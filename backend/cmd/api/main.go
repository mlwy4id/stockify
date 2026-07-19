package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/mlwy4id/stockify/internal/http"
	"github.com/mlwy4id/stockify/internal/infrastructure/database"
	"github.com/mlwy4id/stockify/internal/infrastructure/repository"
	// TODO: import handlers after router is set up
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

	if err := database.RunMigrations(sqlDB); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	log.Println("migrations applied ✅")

	categoryRepo := repository.NewCategoryRepository(db)
	productRepo := repository.NewProductRepository(db)

	// TODO: init handlers with repos
	// TODO: set up router
	router := http.NewRouter()

	_ = categoryRepo
	_ = productRepo

	router.Run(":8080")
	log.Println("server started ✅")
}
