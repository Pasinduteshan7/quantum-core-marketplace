package controllers

import (
	"net/http"
	"strings"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"
	"quantum-core-backend-go/utils"

	"github.com/gin-gonic/gin"
)

type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	cleanEmail := strings.ToLower(strings.TrimSpace(input.Email))
	var existing models.User
	if err := config.DB.Where("email = ?", cleanEmail).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "An account with this email address already exists"})
		return
	}

	user := models.User{
		Name:  strings.TrimSpace(input.Name),
		Email: cleanEmail,
		Role:  "ROLE_CUSTOMER",
	}

	if err := user.HashPassword(input.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to hash password"})
		return
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database error creating user"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Please provide email and password"})
		return
	}

	cleanEmail := strings.ToLower(strings.TrimSpace(input.Email))
	var user models.User
	if err := config.DB.Where("email = ?", cleanEmail).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid email or password"})
		return
	}

	if err := user.CheckPassword(input.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid email or password"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func GetMe(c *gin.Context) {
	userVal, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Not authenticated"})
		return
	}

	user := userVal.(models.User)
	c.JSON(http.StatusOK, gin.H{
		"id":    user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
	})
}
