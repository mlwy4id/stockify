package middleware

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "JWT_SECRET is not configured"})
			return
		}

		tokenString, err := extractToken(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		claims := &JWTClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		c.Set("userId", claims.UserID)
		c.Set("email", claims.Email)
		c.Next()
	}
}

func extractToken(c *gin.Context) (string, error) {
	if cookie, err := c.Cookie("token"); err == nil && cookie != "" {
		return cookie, nil
	}

	return "", http.ErrNoCookie
}

func GetUserIdFromContext(c *gin.Context) string {
	userId, _ := c.Get("userId")
	return userId.(string)
}

func GenerateToken(userId string, email string) (string, error) {
	secret := os.Getenv("JWT_SECRET")

	claims := JWTClaims{
		UserID: userId,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
