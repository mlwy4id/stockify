package repository

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ProductRepository interface {
	Save(ctx context.Context, product *entity.Product) error
	FindByID(ctx context.Context, id vo.ProductId) (*entity.Product, error)
	FindAllActive(ctx context.Context) ([]*entity.Product, error)
	FindAllArchived(ctx context.Context) ([]*entity.Product, error)
	FindByCategoryID(ctx context.Context, categoryId vo.CategoryId) ([]*entity.Product, error)
	GetStockMovementsByProductID(ctx context.Context, productId vo.ProductId) ([]*entity.StockMovement, error)
	GetAllStockMovements(ctx context.Context) ([]*entity.StockMovement, error)
}
