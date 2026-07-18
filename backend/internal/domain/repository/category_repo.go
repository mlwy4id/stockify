package repository

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CategoryRepository interface {
	Save(ctx context.Context, category *entity.Category) error
	FindByID(ctx context.Context, id vo.CategoryId) (*entity.Category, error)
	FindAll(ctx context.Context) ([]*entity.Category, error)
}
