package entity

import (
	"errors"
	"strings"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type Product struct {
	id                    vo.ProductId
	userId                vo.UserId
	name                  string
	imageUrl              string
	quantity              vo.Quantity
	stockThreshold        vo.StockThreshold
	categoryId            *vo.CategoryId
	stockMovements        []StockMovement
	pendingStockMovements []StockMovement
	archivedAt            *time.Time
}

func NewProduct(userId vo.UserId, name string, imageUrl string, quantity vo.Quantity, stockThreshold vo.StockThreshold, categoryId *vo.CategoryId) (Product, error) {
	trimmedName := strings.TrimSpace(name)

	if trimmedName == "" {
		return Product{}, errors.New("must provide a product name")
	}

	return Product{
		id:             vo.NewProductId(),
		userId:         userId,
		name:           trimmedName,
		imageUrl:       imageUrl,
		quantity:       quantity,
		stockThreshold: stockThreshold,
		categoryId:     categoryId,
		stockMovements: []StockMovement{},
	}, nil
}

func (p *Product) AddStockMovement(action enum.Action, quantity vo.Quantity, source string, reason string, date time.Time) error {
	if !action.IsValid() {
		return errors.New("invalid action")
	}

	var newQuantity vo.Quantity
	var err error

	switch action {
	case enum.Restock, enum.Refund:
		newQuantity = p.quantity.Add(quantity)
	case enum.Sold, enum.Broken:
		if newQuantity, err = p.quantity.Subtract(quantity); err != nil {
			return err
		}
	default:
		return errors.New("invalid action")
	}

	sm, err := NewStockMovement(p.userId, p.id, action, quantity, newQuantity, source, reason, date)
	if err != nil {
		return err
	}

	p.pendingStockMovements = append(p.pendingStockMovements, sm)
	p.quantity = newQuantity

	return nil
}

func (p *Product) ArchiveProduct() error {
	if p.archivedAt != nil {
		return errors.New("product already archived")
	}

	now := time.Now()
	p.archivedAt = &now

	return nil
}

func (p *Product) ReactivateProduct() error {
	if p.archivedAt == nil {
		return errors.New("product already active")
	}

	p.archivedAt = nil

	return nil
}

func (p *Product) UpdateProduct(name *string, stockThreshold *vo.StockThreshold, categoryId *vo.CategoryId) error {
	if p.archivedAt != nil {
		return errors.New("cannot update archived product")
	}

	if name == nil && stockThreshold == nil && categoryId == nil {
		return errors.New("must update at least one field at the time")
	}

	if name != nil {
		trimmedName := strings.TrimSpace(*name)

		if trimmedName == "" {
			return errors.New("new name cannot be empty")
		}

		p.name = trimmedName
	}

	if stockThreshold != nil {
		p.stockThreshold = *stockThreshold
	}

	if categoryId != nil {
		p.categoryId = categoryId
	}

	return nil
}

func (p Product) Id() vo.ProductId {
	return p.id
}

func (p Product) UserId() vo.UserId {
	return p.userId
}

func (p Product) Name() string {
	return p.name
}

func (p Product) ImageUrl() string {
	return p.imageUrl
}

func (p Product) Quantity() vo.Quantity {
	return p.quantity
}

func (p Product) StockThreshold() vo.StockThreshold {
	return p.stockThreshold
}

func (p Product) CategoryId() *vo.CategoryId {
	return p.categoryId
}

func (p Product) StockMovements() []StockMovement {
	allStockMovements := make([]StockMovement, 0, len(p.stockMovements)+len(p.pendingStockMovements))
	allStockMovements = append(allStockMovements, p.stockMovements...)
	allStockMovements = append(allStockMovements, p.pendingStockMovements...)
	return allStockMovements
}

func (p Product) PendingStockMovements() []StockMovement {
	return p.pendingStockMovements
}

func (p *Product) ClearPendingStockMovements() {
	p.pendingStockMovements = nil
}

func (p Product) ArchivedAt() *time.Time {
	return p.archivedAt
}

func ReconstructProduct(id vo.ProductId, userId vo.UserId, name string, imageUrl string, quantity vo.Quantity, stockThreshold vo.StockThreshold, categoryId *vo.CategoryId, stockMovements []StockMovement, archivedAt *time.Time) Product {
	return Product{
		id:                    id,
		userId:                userId,
		name:                  name,
		imageUrl:              imageUrl,
		quantity:              quantity,
		stockThreshold:        stockThreshold,
		categoryId:            categoryId,
		stockMovements:        stockMovements,
		pendingStockMovements: []StockMovement{},
		archivedAt:            archivedAt,
	}
}
