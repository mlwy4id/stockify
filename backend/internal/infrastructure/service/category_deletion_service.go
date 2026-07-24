package service

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/infrastructure/database/model"
	"gorm.io/gorm"
)

type CategoryDeletionService struct {
	db *gorm.DB
}

func NewCategoryDeletionService(db *gorm.DB) *CategoryDeletionService {
	return &CategoryDeletionService{db: db}
}

func (cds *CategoryDeletionService) DeleteCategoryWithCascade(ctx context.Context, userId vo.UserId, categoryID vo.CategoryId) error {
	return cds.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var categoryModel model.CategoryModel
		if err := tx.Where("user_id = ? AND id = ?", userId.Value(), categoryID.Value()).First(&categoryModel).Error; err != nil {
			return err
		}

		categoryEntity := entity.ReconstructCategory(categoryID, userId, categoryModel.Name, categoryModel.IsDeleted, categoryModel.DeletedAt)
		if err := categoryEntity.DeleteCategory(); err != nil {
			return err
		}

		now := time.Now()
		if err := tx.Model(&categoryModel).Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": now,
		}).Error; err != nil {
			return err
		}

		return tx.Model(&model.ProductModel{}).
			Where("user_id = ? AND category_id = ?", userId.Value(), categoryID.Value()).
			Update("category_id", nil).Error
	})
}
