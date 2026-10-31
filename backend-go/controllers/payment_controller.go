package controllers

import (
	"fmt"
	"net/http"
	"time"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/models"

	"github.com/gin-gonic/gin"
)

type CreatePaymentIntentInput struct {
	OrderID uint `json:"orderId" binding:"required"`
}

type PaymentIntentResponse struct {
	ClientSecret    string  `json:"clientSecret"`
	PaymentIntentID string  `json:"paymentIntentId"`
	Amount          float64 `json:"amount"`
	Currency        string  `json:"currency"`
	Status          string  `json:"status"`
}

func CreatePaymentIntent(c *gin.Context) {
	userID := c.MustGet("userId").(uint)
	role := c.MustGet("userRole").(string)

	var input CreatePaymentIntentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Valid orderId is required"})
		return
	}

	var order models.Order
	if err := config.DB.First(&order, input.OrderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Order not found"})
		return
	}

	if order.UserID != userID && role != "ROLE_ADMIN" {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Not authorized to pay for this order"})
		return
	}

	intentID := fmt.Sprintf("pi_go_%d_%d", order.ID, time.Now().Unix())
	clientSecret := fmt.Sprintf("%s_secret_%d", intentID, time.Now().UnixNano())

	var payment models.Payment
	err := config.DB.Where("order_id = ?", order.ID).First(&payment).Error
	if err != nil {
		payment = models.Payment{
			OrderID:               order.ID,
			StripePaymentIntentID: intentID,
			ClientSecret:          clientSecret,
			Amount:                order.TotalAmount,
			Currency:              "usd",
			Status:                "REQUIRES_PAYMENT_METHOD",
			PaymentMethod:         "card",
		}
		config.DB.Create(&payment)
	} else {
		payment.StripePaymentIntentID = intentID
		payment.ClientSecret = clientSecret
		payment.Amount = order.TotalAmount
		payment.Status = "REQUIRES_PAYMENT_METHOD"
		config.DB.Save(&payment)
	}

	c.JSON(http.StatusOK, PaymentIntentResponse{
		ClientSecret:    payment.ClientSecret,
		PaymentIntentID: payment.StripePaymentIntentID,
		Amount:          payment.Amount,
		Currency:        payment.Currency,
		Status:          payment.Status,
	})
}

func ConfirmPayment(c *gin.Context) {
	intentID := c.Param("paymentIntentId")

	var payment models.Payment
	if err := config.DB.Where("stripe_payment_intent_id = ?", intentID).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Payment record not found"})
		return
	}

	payment.Status = "SUCCEEDED"
	config.DB.Save(&payment)

	// Update Order status to PROCESSING
	config.DB.Model(&models.Order{}).Where("id = ?", payment.OrderID).Update("status", "PROCESSING")

	c.JSON(http.StatusOK, PaymentIntentResponse{
		ClientSecret:    payment.ClientSecret,
		PaymentIntentID: payment.StripePaymentIntentID,
		Amount:          payment.Amount,
		Currency:        payment.Currency,
		Status:          payment.Status,
	})
}
