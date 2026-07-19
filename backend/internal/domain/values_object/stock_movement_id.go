package valueobject

import "github.com/google/uuid"

type StockMovementId struct {
	value string
}

func NewStockMovementId() StockMovementId {
	return StockMovementId{value: uuid.New().String()}
}

func ParseStockMovementId(value string) (StockMovementId, error) {
	return StockMovementId{value: value}, nil
}

func (s StockMovementId) Value() string {
	return s.value
}
