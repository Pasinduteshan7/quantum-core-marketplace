package models

import (
	"time"
)

type Payment struct {
	ID                    uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID               uint      `gorm:"uniqueIndex;not null" json:"orderId"`
	StripePaymentIntentID string    `gorm:"size:255;uniqueIndex;not null" json:"paymentIntentId"`
	ClientSecret          string    `gorm:"size:255" json:"clientSecret"`
	Amount                float64   `gorm:"type:decimal(10,2);not null" json:"amount"`
	Currency              string    `gorm:"size:10;default:'usd'" json:"currency"`
	Status                string    `gorm:"size:50;default:'PENDING'" json:"status"`
	PaymentMethod         string    `gorm:"size:50;default:'card'" json:"paymentMethod"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}
