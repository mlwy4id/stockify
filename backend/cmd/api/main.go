package main

import (
	"log"

	"github.com/joho/godotenv"
	app "github.com/mlwy4id/stockify/internal/application/command/category"
	"github.com/mlwy4id/stockify/internal/http"
	ch "github.com/mlwy4id/stockify/internal/http/category"
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

	// TODO: init handlers with repos
	categoryHandler := ch.NewCategoryHandler(
		app.NewCreateCategoryCommandHandler(categoryRepo),
		app.NewDeleteCategoryCommandHandler(categoryRepo),
		app.NewRenameCategoryCommandHandler(categoryRepo),
	)

	// TODO: set up router
	router := http.NewRouter(http.Handlers{
		Category: categoryHandler,
	})

	router.Run(":8080")
	log.Println("server started ✅")
}
