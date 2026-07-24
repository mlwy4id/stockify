package repository

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	domRepo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/infrastructure/database/model"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) domRepo.CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Save(ctx context.Context, category *entity.Category) error {
	m := &model.CategoryModel{
		ID:        category.Id().Value(),
		UserID:    category.UserId().Value(),
		Name:      category.Name(),
		IsDeleted: category.IsDeleted(),
	}

	if category.DeletedAt() != nil {
		m.DeletedAt = category.DeletedAt()
	}

	return r.db.WithContext(ctx).Save(m).Error
}

func (r *CategoryRepository) FindByID(ctx context.Context, userId vo.UserId, id vo.CategoryId) (*entity.Category, error) {
	var m model.CategoryModel
	err := r.db.WithContext(ctx).Where("user_id = ? AND id = ?", userId.Value(), id.Value()).First(&m).Error
	if err != nil {
		return nil, err
	}

	return r.toEntityFromModel(&m)
}

func (r *CategoryRepository) FindAll(ctx context.Context, userId vo.UserId) ([]*entity.Category, error) {
	var models []model.CategoryModel
	err := r.db.WithContext(ctx).Where("user_id = ?", userId.Value()).Find(&models).Error
	if err != nil {
		return nil, err
	}

	var categories []*entity.Category
	for i := range models {
		c, err := r.toEntityFromModel(&models[i])
		if err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}

	return categories, nil
}

func (r *CategoryRepository) toEntityFromModel(m *model.CategoryModel) (*entity.Category, error) {
	catId, err := vo.ParseCategoryId(m.ID)
	if err != nil {
		return nil, err
	}

	userId, err := vo.ParseUserId(m.UserID)
	if err != nil {
		return nil, err
	}

	c := entity.ReconstructCategory(catId, userId, m.Name, m.IsDeleted, m.DeletedAt)
	return &c, nil
}
