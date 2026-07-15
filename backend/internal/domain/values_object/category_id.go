package valueobject

import "github.com/google/uuid"

type CategoryId struct {
	value string
}

func NewCategoryId() CategoryId {
	return CategoryId{value: uuid.New().String()}
}

func (c CategoryId) Value() string {
	return c.value
}
