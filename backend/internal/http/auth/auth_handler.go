package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/auth"
	query "github.com/mlwy4id/stockify/internal/application/query/auth"
	"github.com/mlwy4id/stockify/internal/http/middleware"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type AuthHandler struct {
	signUpHandler *command.SignUpCommandHandler
	signInHandler *command.SignInCommandHandler
	getMeHandler  *query.GetMeQueryHandler
}

func NewAuthHandler(
	signUpHandler *command.SignUpCommandHandler,
	signInHandler *command.SignInCommandHandler,
	getMeHandler *query.GetMeQueryHandler,
) *AuthHandler {
	return &AuthHandler{
		signUpHandler: signUpHandler,
		signInHandler: signInHandler,
		getMeHandler:  getMeHandler,
	}
}

// SignUp godoc
// @Summary      Register a new user
// @Description  Create a new user account with email, name, and password
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        body body     SignUpRequest true "User registration payload"
// @Success      201  {object} map[string]interface{} "user_id"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      422  {object} map[string]interface{} "email already exists"
// @Router       /auth/sign-up/email [post]
func (h *AuthHandler) SignUp(ctx *gin.Context) {
	var req SignUpRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.SignUpCommand{
		Email:    req.Email,
		Name:     req.Name,
		Password: req.Password,
	}

	id, err := h.signUpHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "user registered successfully",
		"user_id": id,
	})
}

// SignIn godoc
// @Summary      Sign in a user
// @Description  Authenticate with email and password, returns JWT token via cookie
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        body body     SignInRequest true "User credentials"
// @Success      200  {object} map[string]interface{} "user data"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      401  {object} map[string]interface{} "invalid credentials"
// @Router       /auth/sign-in/email [post]
func (h *AuthHandler) SignIn(ctx *gin.Context) {
	var req SignInRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.SignInCommand{
		Email:    req.Email,
		Password: req.Password,
	}

	user, err := h.signInHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	token, err := middleware.GenerateToken(user.ID, user.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	ctx.SetSameSite(http.SameSiteLaxMode)
	ctx.SetCookie("token", token, 86400, "/", "", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "signed in successfully",
		"user":    user,
		"token":   token,
	})
}

// GetMe godoc
// @Summary      Get current user
// @Description  Get authenticated user profile from JWT token
// @Tags         Auth
// @Produce      json
// @Success      200 {object} map[string]interface{} "user data"
// @Failure      401 {object} map[string]interface{} "unauthorized"
// @Router       /auth/me [get]
// @Security     CookieAuth
func (h *AuthHandler) GetMe(ctx *gin.Context) {
	userId := middleware.GetUserIdFromContext(ctx)

	uid, err := vo.ParseUserId(userId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	q := query.GetMeQuery{UserID: uid}
	user, err := h.getMeHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// SignOut godoc
// @Summary      Sign out
// @Description  Clear JWT cookie to sign out
// @Tags         Auth
// @Produce      json
// @Success      200 {object} map[string]interface{} "message"
// @Router       /auth/sign-out [post]
// @Security     CookieAuth
func (h *AuthHandler) SignOut(ctx *gin.Context) {
	ctx.SetCookie("token", "", -1, "/", "", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "signed out successfully",
	})
}
