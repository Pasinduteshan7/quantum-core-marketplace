package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"

	"github.com/gin-gonic/gin"
)

type AddToCartInput struct {
	ProductID string  `json:"productId"`
	ItemCode  string  `json:"itemCode"`
	Name      string  `json:"name" binding:"required"`
	UnitPrice float64 `json:"unitPrice"`
	Price     float64 `json:"price"`
	Quantity  int     `json:"quantity"`
	Image     string  `json:"image"`
}

type UpdateQuantityInput struct {
	Quantity int `json:"quantity"`
}

func fetchUserCart(userID uint) []models.CartItem {
	var items []models.CartItem
	config.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&items)
	for i := range items {
		items[i].TotalPrice = items[i].UnitPrice * float64(items[i].Quantity)
	}
	return items
}

func GetCart(c *gin.Context) {
	userID := c.MustGet("userId").(uint)
	c.JSON(http.StatusOK, fetchUserCart(userID))
}

func AddToCart(c *gin.Context) {
	userID := c.MustGet("userId").(uint)

	var input AddToCartInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	price := input.UnitPrice
	if price == 0 {
		price = input.Price
	}

	qty := input.Quantity
	if qty < 1 {
		qty = 1
	}

	pID := input.ProductID
	if pID == "" {
		pID = input.ItemCode
	}

	var existing models.CartItem
	err := config.DB.Where("user_id = ? AND (product_id = ? OR item_code = ?)", userID, pID, input.ItemCode).First(&existing).Error

	if err == nil {
		existing.Quantity += qty
		config.DB.Save(&existing)
	} else {
		newItem := models.CartItem{
			UserID:    userID,
			ProductID: pID,
			ItemCode:  input.ItemCode,
			Name:      input.Name,
			UnitPrice: price,
			Quantity:  qty,
			Image:     input.Image,
		}
		config.DB.Create(&newItem)
	}

	c.JSON(http.StatusOK, fetchUserCart(userID))
}

func UpdateQuantity(c *gin.Context) {
	userID := c.MustGet("userId").(uint)
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	var input UpdateQuantityInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	if input.Quantity < 1 {
		config.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.CartItem{})
	} else {
		config.DB.Model(&models.CartItem{}).Where("id = ? AND user_id = ?", id, userID).Update("quantity", input.Quantity)
	}

	c.JSON(http.StatusOK, fetchUserCart(userID))
}

func RemoveFromCart(c *gin.Context) {
	userID := c.MustGet("userId").(uint)
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	config.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.CartItem{})
	c.JSON(http.StatusOK, fetchUserCart(userID))
}

func ClearCart(c *gin.Context) {
	userID := c.MustGet("userId").(uint)
	config.DB.Where("user_id = ?", userID).Delete(&models.CartItem{})
	c.JSON(http.StatusOK, gin.H{"success": true, "message": fmt.Sprintf("Cart cleared for user %d", userID)})
}
