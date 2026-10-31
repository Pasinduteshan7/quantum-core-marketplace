package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	category := c.Query("category")
	brand := c.Query("brand")
	search := c.Query("search")
	minPrice := c.Query("minPrice")
	maxPrice := c.Query("maxPrice")
	sort := c.Query("sort")

	query := config.DB.Model(&models.Product{})

	if category != "" && strings.ToLower(category) != "all" {
		query = query.Where("LOWER(category) = ?", strings.ToLower(category))
	}

	if brand != "" && strings.ToLower(brand) != "all" {
		query = query.Where("LOWER(brand) = ?", strings.ToLower(brand))
	}

	if minPrice != "" {
		if val, err := strconv.ParseFloat(minPrice, 64); err == nil {
			query = query.Where("price >= ?", val)
		}
	}

	if maxPrice != "" {
		if val, err := strconv.ParseFloat(maxPrice, 64); err == nil {
			query = query.Where("price <= ?", val)
		}
	}

	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(item_code) LIKE ? OR LOWER(description) LIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm)
	}

	var total int64
	query.Count(&total)

	// Sorting
	switch sort {
	case "price_asc":
		query = query.Order("price asc")
	case "price_desc":
		query = query.Order("price desc")
	case "rating":
		query = query.Order("rating desc")
	default:
		query = query.Order("created_at desc")
	}

	var products []models.Product
	if err := query.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    total,
	})
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	var err error

	if numID, parseErr := strconv.Atoi(id); parseErr == nil {
		err = config.DB.First(&product, numID).Error
	} else {
		err = config.DB.Where("item_code = ?", id).First(&product).Error
	}

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	if product.Image == "" && product.ImageUrl != "" {
		product.Image = product.ImageUrl
	}
	if product.ImageUrl == "" && product.Image != "" {
		product.ImageUrl = product.Image
	}

	if err := config.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Failed to create product: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		if err := config.DB.Where("item_code = ?", id).First(&product).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Product not found"})
			return
		}
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	if err := config.DB.Model(&product).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update product"})
		return
	}

	config.DB.First(&product, product.ID)
	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		if err := config.DB.Where("item_code = ?", id).First(&product).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Product not found"})
			return
		}
	}

	if err := config.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete product"})
		return
	}

	c.Status(http.StatusNoContent)
}
