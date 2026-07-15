package entity

import (
	"errors"
	"strings"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type Product struct {
	id             vo.ProductId
	name           string
	quantity       vo.Quantity
	stockThreshold vo.StockThreshold
	categoryId     vo.CategoryId
	stockMovements []StockMovement
}

func NewProduct(name string, quantity vo.Quantity, stockThreshold vo.StockThreshold, categoryId vo.CategoryId) (Product, error) {
	trimmedName := strings.TrimSpace(name)

	if trimmedName == "" {
		return Product{}, errors.New("must provide a product name")
	}

	return Product{
		id:             vo.NewProductId(),
		name:           trimmedName,
		quantity:       quantity,
		stockThreshold: stockThreshold,
		categoryId:     categoryId,
		stockMovements: []StockMovement{},
	}, nil
}

func (p Product) AddStockMovement(action enum.Action, quantity vo.Quantity, source string, reason string, date time.Time) error {
	if !action.IsValid() {
		return errors.New("invalid action")
	}

	if action.String() == "SOLD" || action.String() == "BROKEN" {
		dif, _ := p.quantity.Subtract(quantity)
		if dif.Value() < 0 {
			return errors.New("insufficient stock")
		}
	}

	sm, err := NewStockMovement(action, quantity, source, reason, date)
	if err != nil {
		return err
	}

	p.stockMovements = append(p.stockMovements, sm)

	switch action.String() {
	case "RESTOCK", "REFUND":
		p.quantity = p.quantity.Add(quantity)
	case "SOLD", "BROKEN":
		p.quantity, _ = p.quantity.Subtract(quantity)
	}

	return nil
}
