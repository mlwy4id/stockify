package http

import (
	"github.com/gin-gonic/gin"
	categoryHandler "github.com/mlwy4id/stockify/internal/http/category"
	productHandler "github.com/mlwy4id/stockify/internal/http/product"
	stockMovementHandler "github.com/mlwy4id/stockify/internal/http/stock_movement"
)

type Handlers struct {
	Category      *categoryHandler.CategoryHandler
	Product       *productHandler.ProductHandler
	StockMovement *stockMovementHandler.StockMovementHandler
}

func NewRouter(h Handlers) *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")
	{
		category := api.Group("/category")
		{
			category.GET("/", h.Category.GetAll)
			category.POST("/", h.Category.Create)
			category.GET("/:id", h.Category.GetById)
			category.PATCH("/:id", h.Category.Rename)
			category.DELETE("/:id", h.Category.Delete)
		}

		product := api.Group("/product")
		{
			product.POST("/", h.Product.Create)
			product.PATCH("/:id", h.Product.Update)
			product.PATCH("/:id/archive", h.Product.Archive)
			product.PATCH("/:id/reactivate", h.Product.Reactivate)
			product.GET("/category/:id", h.Product.GetByCategory)
			product.GET("/low-stock", h.Product.GetLowStock)
		}

		stockMovement := api.Group("/stock-movements")
		{
			stockMovement.GET("/", h.StockMovement.GetGlobalSummary)
			stockMovement.GET("/top-movers", h.StockMovement.GetTopMovers)
		}

		productStockMovement := api.Group("/product/:id/stock-movements")
		{
			productStockMovement.POST("/", h.StockMovement.Create)
			productStockMovement.GET("/", h.StockMovement.GetByProductID)
			productStockMovement.GET("/summary", h.StockMovement.GetSummaryByProductID)
		}
	}

	return router
}
