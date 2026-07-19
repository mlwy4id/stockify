package valueobject

import "github.com/google/uuid"

type CategoryId struct {
	value string
}

func NewCategoryId() CategoryId {
	return CategoryId{value: uuid.New().String()}
}

func ParseCategoryId(value string) (CategoryId, error) {
	return CategoryId{value: value}, nil
}

func (c CategoryId) Value() string {
	return c.value
}
