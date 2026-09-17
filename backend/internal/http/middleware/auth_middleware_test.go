package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/mlwy4id/stockify/internal/http/middleware"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setUpAuthRouter(t *testing.T, secret string) *gin.Engine {
	t.Helper()
	gin.SetMode(gin.TestMode)
	if secret == "" {
		t.Setenv("JWT_SECRET", "")
	} else {
		t.Setenv("JWT_SECRET", secret)
	}

	engine := gin.New()
	engine.Use(middleware.Auth())
	engine.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"userId": middleware.GetUserIdFromContext(c),
			"email":  c.GetString("email"),
		})
	})
	return engine
}

func signedToken(t *testing.T, claims middleware.JWTClaims, key []byte) string {
	t.Helper()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(key)
	require.NoError(t, err)
	return signed
}

func performRequest(engine *gin.Engine, token string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	if token != "" {
		req.AddCookie(&http.Cookie{Name: "token", Value: token})
	}
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, req)
	return recorder
}

func Test_AuthMiddleware_TokenValidation_ExpectedResults(t *testing.T) {
	t.Run("aborts with a server error when JWT_SECRET is not configured", func(t *testing.T) {
		t.Setenv("JWT_SECRET", "")

		token, err := middleware.GenerateToken("some-id", "some-email")
		require.NoError(t, err)
		req := httptest.NewRequest(http.MethodGet, "/protected", nil)
		req.AddCookie(&http.Cookie{Name: "token", Value: token})
		recorder := httptest.NewRecorder()

		gin.SetMode(gin.TestMode)
		engine := gin.New()
		engine.Use(middleware.Auth())
		engine.GET("/protected", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ok": true}) })
		engine.ServeHTTP(recorder, req)

		assert.Equal(t, http.StatusInternalServerError, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "JWT_SECRET is not configured")
	})

	t.Run("rejects a request without a token cookie", func(t *testing.T) {
		engine := setUpAuthRouter(t, "test-secret")

		recorder := performRequest(engine, "")

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})

	t.Run("rejects a malformed token", func(t *testing.T) {
		engine := setUpAuthRouter(t, "test-secret")

		recorder := performRequest(engine, "garbage")

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})

	t.Run("rejects a token signed with the wrong secret", func(t *testing.T) {
		engine := setUpAuthRouter(t, "test-secret")

		wrongKeyToken := signedToken(t, middleware.JWTClaims{
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			},
		}, []byte("a-different-secret"))

		recorder := performRequest(engine, wrongKeyToken)

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})

	t.Run("rejects an expired token", func(t *testing.T) {
		engine := setUpAuthRouter(t, "test-secret")

		expiredToken := signedToken(t, middleware.JWTClaims{
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Hour)),
			},
		}, []byte("test-secret"))

		recorder := performRequest(engine, expiredToken)

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})

	t.Run("rejects an unsigned alg=none token", func(t *testing.T) {
		engine := setUpAuthRouter(t, "test-secret")

		noneToken, err := jwt.NewWithClaims(jwt.SigningMethodNone, middleware.JWTClaims{
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			},
		}).SignedString(jwt.UnsafeAllowNoneSignatureType)
		require.NoError(t, err)

		recorder := performRequest(engine, noneToken)

		assert.Equal(t, http.StatusUnauthorized, recorder.Code)
	})

	t.Run("accepts a valid token and forwards its claims", func(t *testing.T) {
		engine := setUpAuthRouter(t, "test-secret")

		token, err := middleware.GenerateToken("user-123", "budi@example.com")
		require.NoError(t, err)
		recorder := performRequest(engine, token)

		assert.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "user-123")
		assert.Contains(t, recorder.Body.String(), "budi@example.com")
	})
}

func Test_GetUserIdFromContext_MissingOrPresent_ExpectedValue(t *testing.T) {
	t.Run("returns the claim value inside a request", func(t *testing.T) {
		gin.SetMode(gin.TestMode)
		engine := gin.New()
		engine.GET("/x", func(c *gin.Context) {
			c.Set("userId", "user-123")
			c.JSON(http.StatusOK, gin.H{"userId": middleware.GetUserIdFromContext(c)})
		})

		recorder := httptest.NewRecorder()
		engine.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/x", nil))

		assert.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "user-123")
	})

	t.Run("returns an empty string outside of the middleware chain", func(t *testing.T) {
		gin.SetMode(gin.TestMode)
		engine := gin.New()
		engine.GET("/x", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"userId": middleware.GetUserIdFromContext(c)})
		})

		recorder := httptest.NewRecorder()
		engine.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/x", nil))

		assert.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), `""`)
		assert.True(t, strings.Contains(recorder.Body.String(), "userId"))
	})
}
