package models

import (
	"time"
)

type ShippingAddress struct {
	FullName   string `json:"fullName"`
	Phone      string `json:"phone"`
	Address    string `json:"address"`
	City       string `json:"city"`
	PostalCode string `json:"postalCode"`
	Notes      string `json:"notes"`
}

type OrderItem struct {
	ID         uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID    uint    `gorm:"index;not null" json:"orderId"`
	ProductID  string  `gorm:"size:100;not null" json:"productId"`
	ItemCode   string  `gorm:"size:100;not null" json:"itemCode"`
	Name       string  `gorm:"size:255;not null" json:"name"`
	UnitPrice  float64 `gorm:"type:decimal(10,2);not null" json:"unitPrice"`
	Price      float64 `gorm:"-" json:"price"`
	Quantity   int     `gorm:"not null" json:"quantity"`
	Image      string  `gorm:"size:500" json:"image"`
	TotalPrice float64 `gorm:"type:decimal(10,2);not null" json:"totalPrice"`
}

func (oi *OrderItem) AfterFind(tx interface{}) error {
	oi.Price = oi.UnitPrice
	return nil
}

type Order struct {
	ID            uint            `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        uint            `gorm:"index;not null" json:"userId"`
	FullName      string          `gorm:"size:100;not null" json:"-"`
	Phone         string          `gorm:"size:50" json:"-"`
	Address       string          `gorm:"size:255;not null" json:"-"`
	City          string          `gorm:"size:100;not null" json:"-"`
	PostalCode    string          `gorm:"size:20" json:"-"`
	Notes         string          `gorm:"type:text" json:"-"`
	PaymentMethod string          `gorm:"size:50;default:'COD'" json:"paymentMethod"`
	TotalAmount   float64         `gorm:"type:decimal(10,2);not null" json:"totalAmount"`
	Status        string          `gorm:"size:50;default:'PENDING'" json:"status"`
	Items         []OrderItem     `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"items"`
	CustomerName  string          `gorm:"-" json:"customerName,omitempty"`
	CustomerEmail string          `gorm:"-" json:"customerEmail,omitempty"`
	Shipping      ShippingAddress `gorm:"-" json:"shippingAddress"`
	CreatedAt     time.Time       `json:"createdAt"`
	UpdatedAt     time.Time       `json:"updatedAt"`
}

func (o *Order) AfterFind(tx interface{}) error {
	o.Shipping = ShippingAddress{
		FullName:   o.FullName,
		Phone:      o.Phone,
		Address:    o.Address,
		City:       o.City,
		PostalCode: o.PostalCode,
		Notes:      o.Notes,
	}
	return nil
}
