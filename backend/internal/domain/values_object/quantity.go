package valueobject

import "errors"

type Quantity struct {
	value int
}

func NewQuantity(value int) (Quantity, error) {
	if value < 0 {
		return Quantity{}, errors.New("item stock must not be negative")
	}

	return Quantity{value: value}, nil
}

func (q Quantity) Value() int {
	return q.value
}

func (q Quantity) Equals(other Quantity) bool {
	return q.value == other.value
}

func (q Quantity) Add(other Quantity) Quantity {
	return Quantity{value: q.value + other.value}
}

func (q Quantity) Subtract(other Quantity) (Quantity, error) {
	if q.value < other.value {
		return Quantity{}, errors.New("insufficient quantity")
	}

	return Quantity{value: q.value - other.value}, nil
}
