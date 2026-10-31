package controllers

import (
	"fmt"
	"net/http"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateOrderItemInput struct {
	ProductID string  `json:"productId"`
	ItemCode  string  `json:"itemCode"`
	Name      string  `json:"name"`
	UnitPrice float64 `json:"unitPrice"`
	Price     float64 `json:"price"`
	Quantity  int     `json:"quantity"`
	Image     string  `json:"image"`
}

type CreateOrderInput struct {
	Items           []CreateOrderItemInput `json:"items" binding:"required"`
	ShippingAddress models.ShippingAddress `json:"shippingAddress" binding:"required"`
	PaymentMethod   string                 `json:"paymentMethod"`
	TotalAmount     float64                `json:"totalAmount"`
	CartItemIDs     []uint                 `json:"cartItemIds"`
}

func CreateOrder(c *gin.Context) {
	userID := c.MustGet("userId").(uint)

	var input CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	if len(input.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No order items provided"})
		return
	}

	// 1. Transactional Execution
	var createdOrder models.Order

	txErr := config.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Check stock & decrement
		for _, it := range input.Items {
			qty := it.Quantity
			if qty < 1 {
				qty = 1
			}

			var prod models.Product
			pID := it.ProductID
			if pID == "" {
				pID = it.ItemCode
			}

			findErr := tx.Where("id = ? OR item_code = ?", pID, it.ItemCode).First(&prod).Error
			if findErr != nil {
				return fmt.Errorf("product '%s' not found", it.Name)
			}

			if prod.Stock < qty {
				return fmt.Errorf("insufficient stock for '%s'. Available: %d, Requested: %d", prod.Name, prod.Stock, qty)
			}

			// Atomic decrement
			if err := tx.Model(&models.Product{}).Where("id = ? AND stock >= ?", prod.ID, qty).
				Update("stock", gorm.Expr("stock - ?", qty)).Error; err != nil {
				return err
			}
		}

		// 2. Build order items
		var orderItems []models.OrderItem
		var calculatedTotal float64

		for _, it := range input.Items {
			unitPrice := it.UnitPrice
			if unitPrice == 0 {
				unitPrice = it.Price
			}
			qty := it.Quantity
			if qty < 1 {
				qty = 1
			}

			lineTotal := unitPrice * float64(qty)
			calculatedTotal += lineTotal

			orderItems = append(orderItems, models.OrderItem{
				ProductID:  it.ProductID,
				ItemCode:   it.ItemCode,
				Name:       it.Name,
				UnitPrice:  unitPrice,
				Price:      unitPrice,
				Quantity:   qty,
				Image:      it.Image,
				TotalPrice: lineTotal,
			})
		}

		total := input.TotalAmount
		if total == 0 {
			total = calculatedTotal
		}

		payMethod := input.PaymentMethod
		if payMethod == "" {
			payMethod = "COD"
		}

		// 3. Create parent Order
		createdOrder = models.Order{
			UserID:        userID,
			FullName:      input.ShippingAddress.FullName,
			Phone:         input.ShippingAddress.Phone,
			Address:       input.ShippingAddress.Address,
			City:          input.ShippingAddress.City,
			PostalCode:    input.ShippingAddress.PostalCode,
			Notes:         input.ShippingAddress.Notes,
			PaymentMethod: payMethod,
			TotalAmount:   total,
			Status:        "PENDING",
			Items:         orderItems,
		}

		if err := tx.Create(&createdOrder).Error; err != nil {
			return err
		}

		// 4. Clean up Cart
		if len(input.CartItemIDs) > 0 {
			tx.Where("id IN ? AND user_id = ?", input.CartItemIDs, userID).Delete(&models.CartItem{})
		} else {
			tx.Where("user_id = ?", userID).Delete(&models.CartItem{})
		}

		return nil
	})

	if txErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": txErr.Error()})
		return
	}

	// Reload with shipping
	createdOrder.Shipping = input.ShippingAddress
	c.JSON(http.StatusCreated, createdOrder)
}

func GetMyOrders(c *gin.Context) {
	userID := c.MustGet("userId").(uint)

	var orders []models.Order
	if err := config.DB.Preload("Items").Where("user_id = ?", userID).Order("created_at desc").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch orders"})
		return
	}

	for i := range orders {
		orders[i].Shipping = models.ShippingAddress{
			FullName:   orders[i].FullName,
			Phone:      orders[i].Phone,
			Address:    orders[i].Address,
			City:       orders[i].City,
			PostalCode: orders[i].PostalCode,
			Notes:      orders[i].Notes,
		}
	}

	c.JSON(http.StatusOK, orders)
}

func GetOrderByID(c *gin.Context) {
	userID := c.MustGet("userId").(uint)
	role := c.MustGet("userRole").(string)
	idStr := c.Param("id")

	var order models.Order
	if err := config.DB.Preload("Items").First(&order, idStr).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Order not found"})
		return
	}

	if order.UserID != userID && role != "ROLE_ADMIN" {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Access denied: cannot view this order invoice"})
		return
	}

	order.Shipping = models.ShippingAddress{
		FullName:   order.FullName,
		Phone:      order.Phone,
		Address:    order.Address,
		City:       order.City,
		PostalCode: order.PostalCode,
		Notes:      order.Notes,
	}

	var user models.User
	if err := config.DB.First(&user, order.UserID).Error; err == nil {
		order.CustomerName = user.Name
		order.CustomerEmail = user.Email
	}

	c.JSON(http.StatusOK, order)
}

func GetAllOrders(c *gin.Context) {
	var orders []models.Order
	if err := config.DB.Preload("Items").Order("created_at desc").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch orders"})
		return
	}

	// Enrich customer names
	for i := range orders {
		orders[i].Shipping = models.ShippingAddress{
			FullName:   orders[i].FullName,
			Phone:      orders[i].Phone,
			Address:    orders[i].Address,
			City:       orders[i].City,
			PostalCode: orders[i].PostalCode,
			Notes:      orders[i].Notes,
		}
		var user models.User
		if err := config.DB.First(&user, orders[i].UserID).Error; err == nil {
			orders[i].CustomerName = user.Name
			orders[i].CustomerEmail = user.Email
		}
	}

	c.JSON(http.StatusOK, orders)
}

func UpdateOrderStatus(c *gin.Context) {
	idStr := c.Param("id")

	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Status is required"})
		return
	}

	validStatuses := map[string]bool{
		"PENDING":    true,
		"PROCESSING": true,
		"SHIPPED":    true,
		"DELIVERED":  true,
		"CANCELLED":  true,
	}

	if !validStatuses[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid order status"})
		return
	}

	var order models.Order
	if err := config.DB.Preload("Items").First(&order, idStr).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Order not found"})
		return
	}

	order.Status = input.Status
	config.DB.Save(&order)

	order.Shipping = models.ShippingAddress{
		FullName:   order.FullName,
		Phone:      order.Phone,
		Address:    order.Address,
		City:       order.City,
		PostalCode: order.PostalCode,
		Notes:      order.Notes,
	}

	c.JSON(http.StatusOK, order)
}
