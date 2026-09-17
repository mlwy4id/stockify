package auth_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/auth"
	"github.com/mlwy4id/stockify/internal/application/query/auth"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	handler "github.com/mlwy4id/stockify/internal/http/auth"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type authHarness struct {
	engine *gin.Engine
	repo   *mocks.MockUserRepository
}

func newAuthHandlerHarness(t *testing.T) authHarness {
	t.Helper()
	t.Setenv("JWT_SECRET", "test-secret")
	t.Setenv("ENVIRONMENT", "TEST")
	gin.SetMode(gin.TestMode)

	repo := new(mocks.MockUserRepository)
	authHandler := handler.NewAuthHandler(
		command.NewSignUpCommandHandler(repo),
		command.NewSignInCommandHandler(repo),
		auth.NewGetMeQueryHandler(repo),
	)

	engine := gin.New()
	authGroup := engine.Group("/api/auth")
	authGroup.POST("/sign-up/email", authHandler.SignUp)
	authGroup.POST("/sign-in/email", authHandler.SignIn)

	protected := engine.Group("/api")
	protected.Use(func(c *gin.Context) { c.Set("userId", c.GetHeader("X-Test-User")); c.Next() })
	protected.GET("/auth/me", authHandler.GetMe)
	protected.POST("/auth/sign-out", authHandler.SignOut)

	return authHarness{engine: engine, repo: repo}
}

func doJSON(t *testing.T, engine *gin.Engine, method, path, body string, cookies ...*http.Cookie) *httptest.ResponseRecorder {
	t.Helper()
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}
	for _, c := range cookies {
		req.AddCookie(c)
	}
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, req)
	return recorder
}

func Test_AuthHandler_SignUp_AllCases_CorrectResults(t *testing.T) {
	t.Run("rejects an invalid payload with 400", func(t *testing.T) {
		h := newAuthHandlerHarness(t)

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-up/email", `{"email":"not-an-email","name":"Budi","password":"password123"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("rejects a short password with 400", func(t *testing.T) {
		h := newAuthHandlerHarness(t)

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-up/email", `{"email":"budi@example.com","name":"Budi","password":"short"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
	})

	t.Run("creates the account and returns 201 with the user id", func(t *testing.T) {
		h := newAuthHandlerHarness(t)
		h.repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, errors.New("not found"))
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-up/email", `{"email":"budi@example.com","name":"Budi","password":"password123"}`)

		assert.Equal(t, http.StatusCreated, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "user_id")
		h.repo.AssertExpectations(t)
	})

	t.Run("maps a duplicate email to 422", func(t *testing.T) {
		h := newAuthHandlerHarness(t)
		existing := mocks.MustUser(t, "budi@example.com", "Budi", "hash")
		h.repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(&existing, nil)

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-up/email", `{"email":"budi@example.com","name":"Budi","password":"password123"}`)

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
		assert.Contains(t, recorder.Body.String(), command.ErrEmailAlreadyExists.Error())
	})
}

func Test_AuthHandler_SignIn_AllCases_CorrectResults(t *testing.T) {
	t.Run("rejects invalid credentials with 401", func(t *testing.T) {
		h := newAuthHandlerHarness(t)
		h.repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, errors.New("not found"))

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-in/email", `{"email":"budi@example.com","password":"password123"}`)

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})

	t.Run("signs in and sets an httponly token cookie", func(t *testing.T) {
		h := newAuthHandlerHarness(t)
		// bcrypt-min-cost hash of "password123", generated with bcrypt.GenerateFromPassword.
		user := mocks.MustUser(t, "budi@example.com", "Budi", mustHash(t, "password123"))
		h.repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(&user, nil)

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-in/email", `{"email":"budi@example.com","password":"password123"}`)

		assert.Equal(t, http.StatusOK, recorder.Code)
		cookies := recorder.Result().Cookies()
		require.Len(t, cookies, 1)
		assert.Equal(t, "token", cookies[0].Name)
		assert.True(t, cookies[0].HttpOnly)
		assert.False(t, cookies[0].Secure, "the cookie is only secure in PROD")
		assert.Contains(t, recorder.Body.String(), "signed in successfully")
	})

	t.Run("rejects a malformed payload with 400", func(t *testing.T) {
		h := newAuthHandlerHarness(t)

		recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-in/email", `{"email":"nope"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
	})
}

func Test_AuthHandler_GetMe_AllCases_CorrectResults(t *testing.T) {
	t.Run("returns the profile of the user id in the context", func(t *testing.T) {
		h := newAuthHandlerHarness(t)
		user := mocks.MustUser(t, "budi@example.com", "Budi", "hash")
		h.repo.On("FindByID", mock.Anything, mock.Anything).Return(&user, nil)

		req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
		req.Header.Set("X-Test-User", user.Id().Value())
		recorder := httptest.NewRecorder()
		h.engine.ServeHTTP(recorder, req)

		assert.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "budi@example.com")
	})

	t.Run("propagates a lookup failure as 401", func(t *testing.T) {
		h := newAuthHandlerHarness(t)
		h.repo.On("FindByID", mock.Anything, mock.Anything).Return(nil, errors.New("not found"))

		req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
		req.Header.Set("X-Test-User", vo.NewUserId().Value())
		recorder := httptest.NewRecorder()
		h.engine.ServeHTTP(recorder, req)

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})
}

func Test_AuthHandler_SignOut_AllCases_CorrectResults(t *testing.T) {
	h := newAuthHandlerHarness(t)

	recorder := doJSON(t, h.engine, http.MethodPost, "/api/auth/sign-out", "")

	assert.Equal(t, http.StatusOK, recorder.Code)
	cookies := recorder.Result().Cookies()
	require.Len(t, cookies, 1)
	assert.Equal(t, "token", cookies[0].Name)
	assert.Equal(t, "", cookies[0].Value)
	assert.Less(t, cookies[0].MaxAge, 0, "a negative max age clears the cookie")
}
