package models

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	ItemCode      string         `gorm:"size:100;uniqueIndex;not null" json:"itemCode"`
	Name          string         `gorm:"size:255;not null" json:"name"`
	Brand         string         `gorm:"size:100;index;not null" json:"brand"`
	Category      string         `gorm:"size:100;index;not null" json:"category"`
	SubCategory   string         `gorm:"size:100" json:"subCategory"`
	Price         float64        `gorm:"type:decimal(10,2);not null" json:"price"`
	OriginalPrice float64        `gorm:"type:decimal(10,2)" json:"originalPrice"`
	Discount      string         `gorm:"size:50" json:"discount"`
	Stock         int            `gorm:"default:10" json:"stock"`
	Rating        float64        `gorm:"type:decimal(3,2);default:4.5" json:"rating"`
	ReviewsCount  int            `gorm:"default:0" json:"reviewsCount"`
	ReviewCount   int            `gorm:"-" json:"reviewCount"`
	IsFeatured    bool           `gorm:"default:false" json:"isFeatured"`
	Image         string         `gorm:"size:500" json:"image"`
	ImageUrl      string         `gorm:"size:500" json:"imageUrl"`
	Description   string         `gorm:"type:text" json:"description"`
	Specs         string         `gorm:"type:text" json:"specs"`
	Badge         string         `gorm:"size:50" json:"badge"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *Product) AfterFind(tx *gorm.DB) (err error) {
	if p.Image == "" && p.ImageUrl != "" {
		p.Image = p.ImageUrl
	}
	if p.ImageUrl == "" && p.Image != "" {
		p.ImageUrl = p.Image
	}
	p.ReviewCount = p.ReviewsCount
	return nil
}
