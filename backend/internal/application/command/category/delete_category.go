package category

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type DeleteCategoryCommand struct {
	Id vo.CategoryId
}

type DeleteCategoryHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewDeleteCategoryHandler(categoryRepo repo.CategoryRepository) *DeleteCategoryHandler {
	return &DeleteCategoryHandler{categoryRepo: categoryRepo}
}

func (h *DeleteCategoryHandler) Handle(ctx context.Context, command DeleteCategoryCommand) error {
	category, err := h.categoryRepo.FindByID(ctx, command.Id)

	if err != nil {
		return err
	}

	category.DeleteCategory()

	if err := h.categoryRepo.Save(ctx, category); err != nil {
		return err
	}

	return nil
}
