package repository

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	domRepo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/infrastructure/database/model"
	"gorm.io/gorm"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) domRepo.ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) Save(ctx context.Context, product *entity.Product) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		m := &model.ProductModel{
			ID:             product.Id().Value(),
			UserID:         product.UserId().Value(),
			Name:           product.Name(),
			Quantity:       product.Quantity().Value(),
			StockThreshold: product.StockThreshold().Value(),
		}

		if product.CategoryId() != nil {
			categoryId := product.CategoryId().Value()
			m.CategoryID = &categoryId
		}

		if product.ArchivedAt() != nil {
			m.ArchivedAt = product.ArchivedAt()
		}

		if err := tx.Save(m).Error; err != nil {
			return err
		}

		pending := product.PendingStockMovements()
		if len(pending) > 0 {
			movements := make([]model.StockMovementModel, len(pending))
			for i, sm := range pending {
				movements[i] = model.StockMovementModel{
					ID:        sm.Id().Value(),
					UserID:    sm.UserId().Value(),
					ProductID: sm.ProductId().Value(),
					Action:    sm.Action().String(),
					Quantity:       sm.Quantity().Value(),
					ProductBalance: sm.ProductBalance().Value(),
					Source:    sm.Source(),
					Reason:    sm.Reason(),
					Date:      sm.Date(),
				}
			}

			if err := tx.Create(&movements).Error; err != nil {
				return err
			}
		}

		product.ClearPendingStockMovements()
		return nil
	})
}

func (r *ProductRepository) FindByID(ctx context.Context, userId vo.UserId, id vo.ProductId) (*entity.Product, error) {
	var m model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("user_id = ? AND id = ?", userId.Value(), id.Value()).First(&m).Error
	if err != nil {
		return nil, err
	}

	return r.toEntityFromModel(&m)
}

func (r *ProductRepository) FindAllActive(ctx context.Context, userId vo.UserId) ([]*entity.Product, error) {
	var models []model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("user_id = ? AND archived_at IS NULL", userId.Value()).Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toEntities(models)
}

func (r *ProductRepository) FindAllArchived(ctx context.Context, userId vo.UserId) ([]*entity.Product, error) {
	var models []model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("user_id = ? AND archived_at IS NOT NULL", userId.Value()).Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toEntities(models)
}

func (r *ProductRepository) FindByCategoryID(ctx context.Context, userId vo.UserId, categoryId vo.CategoryId) ([]*entity.Product, error) {
	var models []model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("user_id = ? AND category_id = ?", userId.Value(), categoryId.Value()).Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toEntities(models)
}

func (r *ProductRepository) RemoveCategoryByCategoryId(ctx context.Context, userId vo.UserId, categoryId vo.CategoryId) error {
	return r.db.WithContext(ctx).Model(&model.ProductModel{}).Where("user_id = ? AND category_id = ?", userId.Value(), categoryId.Value()).Update("category_id", nil).Error
}

func (r *ProductRepository) GetStockMovementsByProductID(ctx context.Context, userId vo.UserId, productId vo.ProductId) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).Where("user_id = ? AND product_id = ?", userId.Value(), productId.Value()).Order("date DESC").Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetStockMovementsByProductIDAndDateRange(ctx context.Context, userId vo.UserId, productId vo.ProductId, start time.Time, end time.Time) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND product_id = ? AND date BETWEEN ? AND ?", userId.Value(), productId.Value(), start, end).
		Order("date DESC").
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetAllStockMovements(ctx context.Context, userId vo.UserId) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).Where("user_id = ?", userId.Value()).Order("date DESC").Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetAllStockMovementsAndDateRange(ctx context.Context, userId vo.UserId, start time.Time, end time.Time) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND date BETWEEN ? AND ?", userId.Value(), start, end).
		Order("date DESC").
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetTotalQuantity(ctx context.Context, userId vo.UserId) (int, error) {
	var total int
	err := r.db.WithContext(ctx).
		Model(&model.ProductModel{}).
		Where("user_id = ? AND archived_at IS NULL", userId.Value()).
		Select("COALESCE(SUM(quantity), 0)").
		Scan(&total).Error
	if err != nil {
		return 0, err
	}

	return total, nil
}

func (r *ProductRepository) toEntityFromModel(m *model.ProductModel) (*entity.Product, error) {
	productId, err := vo.ParseProductId(m.ID)
	if err != nil {
		return nil, err
	}

	userId, err := vo.ParseUserId(m.UserID)
	if err != nil {
		return nil, err
	}

	var categoryId *vo.CategoryId
	if m.CategoryID != nil {
		catId, err := vo.ParseCategoryId(*m.CategoryID)
		if err != nil {
			return nil, err
		}
		categoryId = &catId
	}

	quantity := vo.ReconstructQuantity(m.Quantity)
	threshold := vo.ReconstructStockThreshold(m.StockThreshold)

	stockMovements := make([]entity.StockMovement, len(m.StockMovements))
	for i, sm := range m.StockMovements {
		esm, err := r.toStockMovementEntity(&sm)
		if err != nil {
			return nil, err
		}
		stockMovements[i] = *esm
	}

	p := entity.ReconstructProduct(productId, userId, m.Name, quantity, threshold, categoryId, stockMovements, m.ArchivedAt)
	return &p, nil
}

func (r *ProductRepository) toEntities(models []model.ProductModel) ([]*entity.Product, error) {
	products := make([]*entity.Product, len(models))
	for i := range models {
		p, err := r.toEntityFromModel(&models[i])
		if err != nil {
			return nil, err
		}
		products[i] = p
	}
	return products, nil
}

func (r *ProductRepository) toStockMovementEntity(m *model.StockMovementModel) (*entity.StockMovement, error) {
	smId, err := vo.ParseStockMovementId(m.ID)
	if err != nil {
		return nil, err
	}

	userId, err := vo.ParseUserId(m.UserID)
	if err != nil {
		return nil, err
	}

	productId, err := vo.ParseProductId(m.ProductID)
	if err != nil {
		return nil, err
	}

	movement := entity.ReconstructStockMovement(smId, userId, productId, m.Action, m.Quantity, m.ProductBalance, m.Source, m.Reason, m.Date)
	return &movement, nil
}

func (r *ProductRepository) toStockMovementEntities(models []model.StockMovementModel) ([]*entity.StockMovement, error) {
	movements := make([]*entity.StockMovement, len(models))
	for i := range models {
		m, err := r.toStockMovementEntity(&models[i])
		if err != nil {
			return nil, err
		}
		movements[i] = m
	}
	return movements, nil
}
