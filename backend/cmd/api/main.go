package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/mlwy4id/stockify/internal/infrastructure/database"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using system env")
	}

	db, err := database.NewGormDB()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	// lanjut init repository, router, dsb
}
