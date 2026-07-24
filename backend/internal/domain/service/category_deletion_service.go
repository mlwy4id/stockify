package service

import (
	"context"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CategoryDeletionService interface {
	DeleteCategoryWithCascade(ctx context.Context, userId vo.UserId, categoryID vo.CategoryId) error
}
