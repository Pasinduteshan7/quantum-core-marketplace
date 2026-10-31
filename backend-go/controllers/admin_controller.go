package controllers

import (
	"net/http"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"

	"github.com/gin-gonic/gin"
)

type DashboardStats struct {
	TotalRevenue  float64 `json:"totalRevenue"`
	TotalOrders   int64   `json:"totalOrders"`
	PendingOrders int64   `json:"pendingOrders"`
	TotalProducts int64   `json:"totalProducts"`
	TotalUsers    int64   `json:"totalUsers"`
}

func GetStats(c *gin.Context) {
	var totalOrders int64
	config.DB.Model(&models.Order{}).Count(&totalOrders)

	var pendingOrders int64
	config.DB.Model(&models.Order{}).Where("status = ?", "PENDING").Count(&pendingOrders)

	var totalProducts int64
	config.DB.Model(&models.Product{}).Count(&totalProducts)

	var totalUsers int64
	config.DB.Model(&models.User{}).Count(&totalUsers)

	var totalRevenue float64
	row := config.DB.Model(&models.Order{}).Where("status != ?", "CANCELLED").Select("COALESCE(SUM(total_amount), 0)").Row()
	_ = row.Scan(&totalRevenue)

	stats := DashboardStats{
		TotalRevenue:  totalRevenue,
		TotalOrders:   totalOrders,
		PendingOrders: pendingOrders,
		TotalProducts: totalProducts,
		TotalUsers:    totalUsers,
	}

	c.JSON(http.StatusOK, stats)
}

func GetAllProductsAdmin(c *gin.Context) {
	var products []models.Product
	if err := config.DB.Order("created_at desc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch products"})
		return
	}
	c.JSON(http.StatusOK, products)
}

func GetAllUsersAdmin(c *gin.Context) {
	var users []models.User
	if err := config.DB.Order("created_at desc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}
