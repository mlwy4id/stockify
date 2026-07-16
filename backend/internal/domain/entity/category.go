package entity

import (
	"errors"
	"strings"
	"time"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type Category struct {
	id        vo.CategoryId
	name      string
	isDeleted bool
	deletedAt *time.Time
}

func NewCategory(name string) (Category, error) {
	trimmedName := strings.TrimSpace(name)

	if trimmedName == "" {
		return Category{}, errors.New("category name must not empty")
	}

	return Category{
		id:        vo.NewCategoryId(),
		name:      trimmedName,
		isDeleted: false,
	}, nil
}

func (c *Category) RenameCategory(name string) error {
	trimmedName := strings.TrimSpace(name)

	if trimmedName == "" {
		return errors.New("must provide a new category name")
	}

	c.name = trimmedName
	return nil
}

func (c *Category) DeleteCategory() error {
	if c.isDeleted {
		return errors.New("category is already deleted")
	}

	now := time.Now()
	c.isDeleted = true
	c.deletedAt = &now

	return nil
}

func (c Category) Id() vo.CategoryId {
	return c.id
}

func (c Category) Name() string {
	return c.name
}

func (c Category) IsDeleted() bool {
	return c.isDeleted
}

func (c Category) DeletedAt() *time.Time {
	return c.deletedAt
}
