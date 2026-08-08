package main

import (
	"log"

	"github.com/joho/godotenv"
	_ "github.com/mlwy4id/stockify/cmd/api/docs"
	authCommand "github.com/mlwy4id/stockify/internal/application/command/auth"
	categoryCommand "github.com/mlwy4id/stockify/internal/application/command/category"
	productCommand "github.com/mlwy4id/stockify/internal/application/command/product"
	stockMovementCommand "github.com/mlwy4id/stockify/internal/application/command/stock_movement"
	authQuery "github.com/mlwy4id/stockify/internal/application/query/auth"
	categoryQuery "github.com/mlwy4id/stockify/internal/application/query/category"
	productQuery "github.com/mlwy4id/stockify/internal/application/query/product"
	stockMovementQuery "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	"github.com/mlwy4id/stockify/internal/http"
	authHandler "github.com/mlwy4id/stockify/internal/http/auth"
	categoryHandler "github.com/mlwy4id/stockify/internal/http/category"
	productHandler "github.com/mlwy4id/stockify/internal/http/product"
	stockMovementHandler "github.com/mlwy4id/stockify/internal/http/stock_movement"
	"github.com/mlwy4id/stockify/internal/infrastructure/database"
	"github.com/mlwy4id/stockify/internal/infrastructure/repository"
	"github.com/mlwy4id/stockify/internal/infrastructure/service"
)

// @title           Stockify API
// @version         1.0
// @description     Stock management application API.
// @host            localhost:8080
// @BasePath        /api
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @securityDefinitions.apikey CookieAuth
// @in cookie
// @name token
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

	// Repositories
	categoryRepo := repository.NewCategoryRepository(db)
	productRepo := repository.NewProductRepository(db)
	userRepo := repository.NewUserRepository(db)

	// Services
	categoryDeletionService := service.NewCategoryDeletionService(db)

	// Auth Handler
	authH := authHandler.NewAuthHandler(
		authCommand.NewSignUpCommandHandler(userRepo),
		authCommand.NewSignInCommandHandler(userRepo),
		authQuery.NewGetMeQueryHandler(userRepo),
	)

	// Category Handler
	categoryH := categoryHandler.NewCategoryHandler(
		categoryCommand.NewCreateCategoryCommandHandler(categoryRepo),
		categoryCommand.NewDeleteCategoryCommandHandler(categoryDeletionService),
		categoryCommand.NewRenameCategoryCommandHandler(categoryRepo),
		categoryQuery.NewGetAllCategoryQueryHandler(categoryRepo),
		categoryQuery.NewGetCategoryByIDQueryHandler(categoryRepo),
	)

	// Product Handler
	productH := productHandler.NewProductHandler(
		productCommand.NewCreateProductCommandHandler(productRepo),
		productCommand.NewUpdateProductCommandHandler(productRepo),
		productCommand.NewArchiveProductCommandHandler(productRepo),
		productCommand.NewReactivateProductCommandHandler(productRepo),
		productQuery.NewGetAllProductsHandler(productRepo),
		productQuery.NewGetProductByCategoryHandler(productRepo),
		productQuery.NewGetLowStockProductsHandler(productRepo),
		productQuery.NewGetProductDashboardByProductIDHandler(productRepo),
	)

	// Stock Movement Handler
	stockMovementH := stockMovementHandler.NewStockMovementHandler(
		stockMovementCommand.NewCreateStockMovementCommandHandler(productRepo),
		stockMovementQuery.NewGetStockMovementByProductIDHandler(productRepo),
		stockMovementQuery.NewGetGlobalStockMovementSummaryHandler(productRepo),
		stockMovementQuery.NewGetTopMoversHandler(productRepo),
		stockMovementQuery.NewGetStockChartByProductIDHandler(productRepo),
		stockMovementQuery.NewGetStockChartHandler(productRepo),
	)

	router := http.NewRouter(http.Handlers{
		Auth:          authH,
		Category:      categoryH,
		Product:       productH,
		StockMovement: stockMovementH,
	})

	router.Run(":8080")
	log.Println("server started ✅")
}
