package main

import (
	"log"

	"github.com/joho/godotenv"
	categoryCommand "github.com/mlwy4id/stockify/internal/application/command/category"
	categoryQuery "github.com/mlwy4id/stockify/internal/application/query/category"
	"github.com/mlwy4id/stockify/internal/http"
	categoryHandler "github.com/mlwy4id/stockify/internal/http/category"
	"github.com/mlwy4id/stockify/internal/infrastructure/database"
	"github.com/mlwy4id/stockify/internal/infrastructure/repository"
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

	// Wiring Handler With Repository Implementation
	categoryRepo := repository.NewCategoryRepository(db)

	categoryHandler := categoryHandler.NewCategoryHandler(
		categoryCommand.NewCreateCategoryCommandHandler(categoryRepo),
		categoryCommand.NewDeleteCategoryCommandHandler(categoryRepo),
		categoryCommand.NewRenameCategoryCommandHandler(categoryRepo),
		categoryQuery.NewGetAllCategoryQueryHandler(categoryRepo),
		categoryQuery.NewGetCategoryByIDQueryHandler(categoryRepo),
	)

	router := http.NewRouter(http.Handlers{
		Category: categoryHandler,
	})

	router.Run(":8080")
	log.Println("server started ✅")
}
