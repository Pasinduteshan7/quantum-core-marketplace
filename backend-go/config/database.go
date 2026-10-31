package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"quantum-core-backend-go/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "root"
	}
	pass := os.Getenv("DB_PASSWORD")
	if pass == "" {
		pass = "root"
	}
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "127.0.0.1"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "3306"
	}
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "quantumcore_db"
	}

	// 1. Ensure the MySQL database exists
	serverDSN := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local", user, pass, host, port)
	rawDB, err := sql.Open("mysql", serverDSN)
	if err == nil {
		_, err = rawDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", dbname))
		if err != nil {
			log.Printf("Notice: could not auto-create database (might already exist): %v", err)
		}
		rawDB.Close()
	}

	// 2. Connect to the target database via GORM
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, host, port, dbname)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("❌ Failed to connect to MySQL database: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("❌ Failed to get generic database object: %v", err)
	}

	// Connection Pool Settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("✔ Connected to MySQL Database (InnoDB Engine) via GORM successfully!")

	// 3. Auto-Migrate Schemas
	err = db.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
	)
	if err != nil {
		log.Fatalf("❌ AutoMigration failed: %v", err)
	}
	log.Println("✔ Database schemas migrated successfully (users, products, cart_items, orders, order_items, payments)")

	DB = db
}
