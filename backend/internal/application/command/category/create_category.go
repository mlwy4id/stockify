package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
)

type CreateCategoryCommand struct {
	Name string
}

type CreateCategoryHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewCreateCategoryHandler(categoryRepo repo.CategoryRepository) *CreateCategoryHandler {
	return &CreateCategoryHandler{categoryRepo: categoryRepo}
}

func (h *CreateCategoryHandler) Handle(ctx context.Context, command CreateCategoryCommand) (string, error) {
	category, err := entity.NewCategory(command.Name)

	if err != nil {
		return "", err
	}

	if err := h.categoryRepo.Save(ctx, &category); err != nil {
		return "", err
	}

	return category.Id().Value(), nil
}
