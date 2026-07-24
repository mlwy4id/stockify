package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CreateCategoryCommand struct {
	UserId vo.UserId
	Name   string
}

type CreateCategoryCommandHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewCreateCategoryCommandHandler(categoryRepo repo.CategoryRepository) *CreateCategoryCommandHandler {
	return &CreateCategoryCommandHandler{categoryRepo: categoryRepo}
}

func (h *CreateCategoryCommandHandler) Handle(ctx context.Context, command CreateCategoryCommand) (string, error) {
	category, err := entity.NewCategory(command.UserId, command.Name)

	if err != nil {
		return "", err
	}

	if err := h.categoryRepo.Save(ctx, &category); err != nil {
		return "", err
	}

	return category.Id().Value(), nil
}
