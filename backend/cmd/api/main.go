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

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal(err)
	}

	if database.RunMigrations(sqlDB); err != nil {
		log.Fatalf("migration failed: %w", err)
	}

	log.Println("migrations applied ✅")
}
