package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"quantum-core-backend-go/config"
	"quantum-core-backend-go/controllers"
	"quantum-core-backend-go/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load environment variables
	_ = godotenv.Load()

	// 2. Initialize MySQL Database & Seeder
	config.ConnectDatabase()
	config.SeedDatabase()

	// 3. Configure Gin
	mode := os.Getenv("GIN_MODE")
	if mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// Health Check
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":   "ONLINE",
			"engine":   "Quantum Core Go Gin Engine",
			"database": "MySQL 8 (InnoDB)",
			"port":     8081,
		})
	})

	api := router.Group("/api")
	{
		// ════════ AUTH ROUTES ════════
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.GET("/me", middleware.Protect(), controllers.GetMe)
		}

		// ════════ PRODUCT ROUTES ════════
		products := api.Group("/products")
		{
			products.GET("", controllers.GetProducts)
			products.GET("/:id", controllers.GetProductByID)
			products.POST("", middleware.Protect(), middleware.Admin(), controllers.CreateProduct)
			products.PUT("/:id", middleware.Protect(), middleware.Admin(), controllers.UpdateProduct)
			products.DELETE("/:id", middleware.Protect(), middleware.Admin(), controllers.DeleteProduct)
		}

		// ════════ CART ROUTES ════════
		cart := api.Group("/cart", middleware.Protect())
		{
			cart.GET("", controllers.GetCart)
			cart.POST("", controllers.AddToCart)
			cart.PUT("/:id", controllers.UpdateQuantity)
			cart.DELETE("/:id", controllers.RemoveFromCart)
			cart.DELETE("", controllers.ClearCart)
		}

		// ════════ ORDER ROUTES ════════
		orders := api.Group("/orders", middleware.Protect())
		{
			orders.POST("", controllers.CreateOrder)
			orders.GET("", controllers.GetMyOrders)
			orders.GET("/:id", controllers.GetOrderByID)
			orders.GET("/admin/all", middleware.Admin(), controllers.GetAllOrders)
			orders.PUT("/:id/status", middleware.Admin(), controllers.UpdateOrderStatus)
		}

		// ════════ ADMIN ROUTES ════════
		admin := api.Group("/admin", middleware.Protect(), middleware.Admin())
		{
			admin.GET("/stats", controllers.GetStats)
			admin.GET("/products", controllers.GetAllProductsAdmin)
			admin.POST("/products", controllers.CreateProduct)
			admin.PUT("/products/:id", controllers.UpdateProduct)
			admin.DELETE("/products/:id", controllers.DeleteProduct)
			admin.GET("/orders", controllers.GetAllOrders)
			admin.PUT("/orders/:id/status", controllers.UpdateOrderStatus)
			admin.GET("/users", controllers.GetAllUsersAdmin)
		}

		// ════════ PAYMENT ROUTES ════════
		payments := api.Group("/payments", middleware.Protect())
		{
			payments.POST("/create-intent", controllers.CreatePaymentIntent)
			payments.POST("/confirm/:paymentIntentId", controllers.ConfirmPayment)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("\n================================================================")
	log.Printf("⚡ Quantum Core Go (Gin) Engine running on http://localhost:%s", port)
	log.Printf("================================================================\n")

	if err := router.Run(addr); err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}
