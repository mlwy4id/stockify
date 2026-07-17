package category

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type RenameCategoryCommand struct {
	Id   vo.CategoryId
	Name string
}

type RenameCategoryHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewRenameCategoryHandler(categoryRepo repo.CategoryRepository) *RenameCategoryHandler {
	return &RenameCategoryHandler{categoryRepo: categoryRepo}
}

func (h *RenameCategoryHandler) Handle(ctx context.Context, command RenameCategoryCommand) (string, error) {
	category, err := h.categoryRepo.FindByID(ctx, command.Id)

	if err != nil {
		return "", err
	}

	category.RenameCategory(command.Name)

	if err := h.categoryRepo.Save(ctx, category); err != nil {
		return "", err
	}

	return category.Id().Value(), nil
}
