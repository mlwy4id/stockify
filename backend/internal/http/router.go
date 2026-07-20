package http

import (
	"github.com/gin-gonic/gin"
	http "github.com/mlwy4id/stockify/internal/http/category"
)

type Handlers struct {
	Category *http.CategoryHandler
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
	}

	return router
}
