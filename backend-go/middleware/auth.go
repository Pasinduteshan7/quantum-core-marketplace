package middleware

import (
	"net/http"
	"strings"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"
	"quantum-core-backend-go/utils"

	"github.com/gin-gonic/gin"
)

func Protect() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Not authorized: no Bearer token provided in Authorization header",
			})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidateToken(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Not authorized: token is invalid or has expired",
			})
			c.Abort()
			return
		}

		var user models.User
		if err := config.DB.First(&user, claims.UserID).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "User belonging to this token no longer exists",
			})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Set("userId", user.ID)
		c.Set("userRole", user.Role)
		c.Next()
	}
}

func Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("userRole")
		if !exists || roleVal.(string) != "ROLE_ADMIN" {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Access denied: administrative privileges required",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
