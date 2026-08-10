package http

import (
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	authHandler "github.com/mlwy4id/stockify/internal/http/auth"
	categoryHandler "github.com/mlwy4id/stockify/internal/http/category"
	"github.com/mlwy4id/stockify/internal/http/middleware"
	productHandler "github.com/mlwy4id/stockify/internal/http/product"
	stockMovementHandler "github.com/mlwy4id/stockify/internal/http/stock_movement"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Handlers struct {
	Auth          *authHandler.AuthHandler
	Category      *categoryHandler.CategoryHandler
	Product       *productHandler.ProductHandler
	StockMovement *stockMovementHandler.StockMovementHandler
}

func NewRouter(h Handlers) *gin.Engine {
	router := gin.Default()

	allowedOrigins := []string{"http://localhost:3000"}
	if origin := os.Getenv("FRONTEND_URL"); origin != "" {
		allowedOrigins = append(allowedOrigins, origin)
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/sign-up/email", h.Auth.SignUp)
			auth.POST("/sign-in/email", h.Auth.SignIn)
		}

		protected := api.Group("")
		protected.Use(middleware.Auth())
		{
			protected.GET("/auth/me", h.Auth.GetMe)
			protected.POST("/auth/sign-out", h.Auth.SignOut)

			category := protected.Group("/category")
			{
				category.GET("/", h.Category.GetAll)
				category.POST("/", h.Category.Create)
				category.GET("/:id", h.Category.GetById)
				category.PATCH("/:id", h.Category.Rename)
				category.DELETE("/:id", h.Category.Delete)
			}

			product := protected.Group("/product")
			{
				product.POST("/", h.Product.Create)
				product.GET("/", h.Product.GetAll)
				product.GET("/category/:id", h.Product.GetByCategory)
				product.GET("/low-stock", h.Product.GetLowStock)
				product.GET("/:id/dashboard", h.Product.GetDashboardByProductId)
				product.GET("/:id/chart", h.StockMovement.GetChartByProductID)
				product.PATCH("/:id", h.Product.Update)
				product.PATCH("/:id/archive", h.Product.Archive)
				product.PATCH("/:id/reactivate", h.Product.Reactivate)
			}

			stockMovement := protected.Group("/stock-movements")
			{
				stockMovement.GET("/", h.StockMovement.GetDashboardSummary)
				stockMovement.GET("/top-movers", h.StockMovement.GetTopMovers)
				stockMovement.GET("/chart", h.StockMovement.GetChart)
			}

			productStockMovement := protected.Group("/product/:id/stock-movements")
			{
				productStockMovement.POST("/", h.StockMovement.Create)
				productStockMovement.GET("/", h.StockMovement.GetByProductID)
			}
		}
	}

	return router
}
