package entity_test

import (
	"testing"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

func mustUserId(t *testing.T) vo.UserId {
	t.Helper()
	return vo.NewUserId()
}

func mustCategoryId(t *testing.T) vo.CategoryId {
	t.Helper()
	return vo.NewCategoryId()
}

func mustQuantity(t *testing.T, value int) vo.Quantity {
	t.Helper()
	q, err := vo.NewQuantity(value)
	if err != nil {
		t.Fatalf("failed to build quantity %d: %v", value, err)
	}
	return q
}

func mustStockThreshold(t *testing.T, value int) vo.StockThreshold {
	t.Helper()
	s, err := vo.NewStockThreshold(value)
	if err != nil {
		t.Fatalf("failed to build stock threshold %d: %v", value, err)
	}
	return s
}

func mustEmail(t *testing.T, value string) vo.Email {
	t.Helper()
	e, err := vo.NewEmail(value)
	if err != nil {
		t.Fatalf("failed to build email %q: %v", value, err)
	}
	return e
}

func mustProduct(t *testing.T, quantity int) entity.Product {
	t.Helper()
	p, err := entity.NewProduct(mustUserId(t), "Kopi Susu", "", mustQuantity(t, quantity), mustStockThreshold(t, 5), nil)
	if err != nil {
		t.Fatalf("failed to build product: %v", err)
	}
	return p
}
