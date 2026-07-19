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
	m := &model.ProductModel{
		ID:             product.Id().Value(),
		Name:           product.Name(),
		Quantity:       product.Quantity().Value(),
		StockThreshold: product.StockThreshold().Value(),
		CategoryID:     product.CategoryId().Value(),
	}

	if product.ArchivedAt() != nil {
		m.ArchivedAt = product.ArchivedAt()
	}

	return r.db.WithContext(ctx).Save(m).Error
}

func (r *ProductRepository) FindByID(ctx context.Context, id vo.ProductId) (*entity.Product, error) {
	var m model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("id = ?", id.Value()).First(&m).Error
	if err != nil {
		return nil, err
	}

	return r.toEntityFromModel(&m)
}

func (r *ProductRepository) FindAllActive(ctx context.Context) ([]*entity.Product, error) {
	var models []model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("archived_at IS NULL").Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toEntities(models)
}

func (r *ProductRepository) FindAllArchived(ctx context.Context) ([]*entity.Product, error) {
	var models []model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("archived_at IS NOT NULL").Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toEntities(models)
}

func (r *ProductRepository) FindByCategoryID(ctx context.Context, categoryId vo.CategoryId) ([]*entity.Product, error) {
	var models []model.ProductModel
	err := r.db.WithContext(ctx).Preload("StockMovements").Where("category_id = ?", categoryId.Value()).Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toEntities(models)
}

func (r *ProductRepository) GetStockMovementsByProductID(ctx context.Context, productId vo.ProductId) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).Where("product_id = ?", productId.Value()).Order("date DESC").Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetStockMovementsByProductIDAndDateRange(ctx context.Context, productId vo.ProductId, start time.Time, end time.Time) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).
		Where("product_id = ? AND date BETWEEN ? AND ?", productId.Value(), start, end).
		Order("date DESC").
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetAllStockMovements(ctx context.Context) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).Order("date DESC").Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) GetAllStockMovementsAndDateRange(ctx context.Context, start time.Time, end time.Time) ([]*entity.StockMovement, error) {
	var models []model.StockMovementModel
	err := r.db.WithContext(ctx).
		Where("date BETWEEN ? AND ?", start, end).
		Order("date DESC").
		Find(&models).Error
	if err != nil {
		return nil, err
	}

	return r.toStockMovementEntities(models)
}

func (r *ProductRepository) toEntityFromModel(m *model.ProductModel) (*entity.Product, error) {
	productId, err := vo.ParseProductId(m.ID)
	if err != nil {
		return nil, err
	}

	categoryId, err := vo.ParseCategoryId(m.CategoryID)
	if err != nil {
		return nil, err
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

	p := entity.ReconstructProduct(productId, m.Name, quantity, threshold, categoryId, stockMovements, m.ArchivedAt)
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

	productId, err := vo.ParseProductId(m.ProductID)
	if err != nil {
		return nil, err
	}

	movement := entity.ReconstructStockMovement(smId, productId, m.Action, m.Quantity, m.Source, m.Reason, m.Date)
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
