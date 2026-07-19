package valueobject

import "github.com/google/uuid"

type ProductId struct {
	value string
}

func NewProductId() ProductId {
	return ProductId{value: uuid.New().String()}
}

func ParseProductId(value string) (ProductId, error) {
	return ProductId{value: value}, nil
}

func (p ProductId) Value() string {
	return p.value
}
