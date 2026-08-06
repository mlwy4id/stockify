package repository

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ProductRepository interface {
	Save(ctx context.Context, product *entity.Product) error
	FindByID(ctx context.Context, userId vo.UserId, id vo.ProductId) (*entity.Product, error)
	FindAllActive(ctx context.Context, userId vo.UserId) ([]*entity.Product, error)
	FindByCategoryID(ctx context.Context, userId vo.UserId, categoryId vo.CategoryId) ([]*entity.Product, error)
	GetStockMovementsByProductID(ctx context.Context, userId vo.UserId, productId vo.ProductId, asc bool) ([]*entity.StockMovement, error)
	GetStockMovementsByProductIDAndDateRange(ctx context.Context, userId vo.UserId, productId vo.ProductId, start time.Time, end time.Time) ([]*entity.StockMovement, error)
	GetAllStockMovements(ctx context.Context, userId vo.UserId) ([]*entity.StockMovement, error)
	GetAllStockMovementsAndDateRange(ctx context.Context, userId vo.UserId, start time.Time, end time.Time) ([]*entity.StockMovement, error)
	GetTotalQuantity(ctx context.Context, userId vo.UserId) (int, error)
	RemoveCategoryByCategoryId(ctx context.Context, userId vo.UserId, categoryId vo.CategoryId) error
}
