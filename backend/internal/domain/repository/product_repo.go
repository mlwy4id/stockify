package repository

import (
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ProductRepository interface {
	Save(product *entity.Product) error
	FindByID(id vo.ProductId) (*entity.Product, error)
	FindAllActive() ([]*entity.Product, error)
	FindAllArchived() ([]*entity.Product, error)
	FindByCategoryID(categoryId vo.CategoryId) ([]*entity.Product, error)
	GetStockMovementsByProductID(productId vo.ProductId) ([]*entity.StockMovement, error)
	GetAllStockMovements() ([]*entity.StockMovement, error)
}
