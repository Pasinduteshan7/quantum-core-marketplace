package models

import (
	"time"
)

type CartItem struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     uint      `gorm:"index;not null" json:"userId"`
	ProductID  string    `gorm:"size:100;not null" json:"productId"`
	ItemCode   string    `gorm:"size:100;not null" json:"itemCode"`
	Name       string    `gorm:"size:255;not null" json:"name"`
	UnitPrice  float64   `gorm:"type:decimal(10,2);not null" json:"unitPrice"`
	Quantity   int       `gorm:"default:1;not null" json:"quantity"`
	Image      string    `gorm:"size:500" json:"image"`
	TotalPrice float64   `gorm:"-" json:"totalPrice"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

func (c *CartItem) AfterFind(tx interface{}) error {
	c.TotalPrice = c.UnitPrice * float64(c.Quantity)
	return nil
}
