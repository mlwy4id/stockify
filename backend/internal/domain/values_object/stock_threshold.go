package valueobject

import "errors"

type StockThreshold struct {
	value int
}

func NewStockThreshold(value int) (StockThreshold, error) {
	if value < 0 {
		return StockThreshold{}, errors.New("stock threshold must not be negative")
	}

	return StockThreshold{value: value}, nil
}

func (s StockThreshold) Value() int {
	return s.value
}
