package config

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"

	"quantum-core-backend-go/models"
)

type ProductJSON struct {
	Name          string      `json:"name"`
	ItemCode      string      `json:"itemCode"`
	Brand         string      `json:"brand"`
	Category      string      `json:"category"`
	SubCategory   string      `json:"subCategory"`
	Price         float64     `json:"price"`
	OriginalPrice float64     `json:"originalPrice"`
	Discount      string      `json:"discount"`
	Stock         int         `json:"stock"`
	Rating        float64     `json:"rating"`
	ReviewsCount  int         `json:"reviewsCount"`
	ReviewCount   int         `json:"reviewCount"`
	IsFeatured    bool        `json:"isFeatured"`
	Image         string      `json:"image"`
	ImageUrl      string      `json:"imageUrl"`
	Description   string      `json:"description"`
	Specs         interface{} `json:"specs"`
	Badge         string      `json:"badge"`
}

func SeedDatabase() {
	// 1. Seed Admin
	var adminCount int64
	DB.Model(&models.User{}).Where("email = ?", "admin@quantumcore.com").Count(&adminCount)
	if adminCount == 0 {
		admin := models.User{
			Name:  "Admin User",
			Email: "admin@quantumcore.com",
			Role:  "ROLE_ADMIN",
		}
		if err := admin.HashPassword("admin123"); err == nil {
			DB.Create(&admin)
			log.Println("✔ Seeded default admin: admin@quantumcore.com")
		}
	}

	// 2. Seed Customer
	var customerCount int64
	DB.Model(&models.User{}).Where("email = ?", "customer@quantumcore.com").Count(&customerCount)
	if customerCount == 0 {
		customer := models.User{
			Name:  "Demo Customer",
			Email: "customer@quantumcore.com",
			Role:  "ROLE_CUSTOMER",
		}
		if err := customer.HashPassword("customer123"); err == nil {
			DB.Create(&customer)
			log.Println("✔ Seeded default customer: customer@quantumcore.com")
		}
	}

	// 3. Seed Products from JSON
	var productCount int64
	DB.Model(&models.Product{}).Count(&productCount)
	if productCount == 0 {
		paths := []string{
			filepath.Join("..", "backend-springboot", "src", "main", "resources", "products.json"),
			filepath.Join("data", "products.json"),
			"products.json",
		}

		var rawData []byte
		var err error
		for _, p := range paths {
			rawData, err = os.ReadFile(p)
			if err == nil {
				break
			}
		}

		if len(rawData) > 0 {
			var rawProducts []ProductJSON
			if err := json.Unmarshal(rawData, &rawProducts); err == nil {
				for _, rp := range rawProducts {
					img := rp.Image
					if img == "" {
						img = rp.ImageUrl
					}
					if img == "" {
						img = "/images/images.jpg"
					}

					specsStr := ""
					if s, ok := rp.Specs.(string); ok {
						specsStr = s
					} else if m, ok := rp.Specs.(map[string]interface{}); ok {
						if d, ok := m["details"].(string); ok {
							specsStr = d
						} else {
							b, _ := json.Marshal(m)
							specsStr = string(b)
						}
					}

					stock := rp.Stock
					if stock == 0 {
						stock = 10
					}

					rating := rp.Rating
					if rating == 0 {
						rating = 4.5
					}

					rc := rp.ReviewsCount
					if rc == 0 {
						rc = rp.ReviewCount
					}

					origPrice := rp.OriginalPrice
					if origPrice == 0 {
						origPrice = rp.Price
					}

					prod := models.Product{
						ItemCode:      rp.ItemCode,
						Name:          rp.Name,
						Brand:         rp.Brand,
						Category:      rp.Category,
						SubCategory:   rp.SubCategory,
						Price:         rp.Price,
						OriginalPrice: origPrice,
						Discount:      rp.Discount,
						Stock:         stock,
						Rating:        rating,
						ReviewsCount:  rc,
						IsFeatured:    rp.IsFeatured,
						Image:         img,
						ImageUrl:      img,
						Description:   rp.Description,
						Specs:         specsStr,
						Badge:         rp.Badge,
					}
					DB.Create(&prod)
				}
				log.Printf("✔ Seeded %d hardware products into MySQL!\n", len(rawProducts))
			} else {
				log.Printf("Warning unmarshaling products.json: %v", err)
			}
		} else {
			log.Println("Notice: products.json not found for seeding")
		}
	} else {
		log.Printf("✔ MySQL inventory already populated (%d products).\n", productCount)
	}
}
