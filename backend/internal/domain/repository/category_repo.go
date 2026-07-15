package repository

import (
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CategoryRepository interface {
	Save(category *entity.Category) error
	FindByID(id vo.CategoryId) (*entity.Category, error)
	FindAll() ([]*entity.Category, error)
	Delete(id vo.CategoryId) error
}