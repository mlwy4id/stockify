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
			category.POST("/new", h.Category.Create)
		}
	}

	return router
}
