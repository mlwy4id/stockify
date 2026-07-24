package category

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type RenameCategoryCommand struct {
	UserId vo.UserId
	Id     vo.CategoryId
	Name   string
}

type RenameCategoryCommandHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewRenameCategoryCommandHandler(categoryRepo repo.CategoryRepository) *RenameCategoryCommandHandler {
	return &RenameCategoryCommandHandler{categoryRepo: categoryRepo}
}

func (h *RenameCategoryCommandHandler) Handle(ctx context.Context, command RenameCategoryCommand) (string, error) {
	category, err := h.categoryRepo.FindByID(ctx, command.UserId, command.Id)

	if err != nil {
		return "", err
	}

	category.RenameCategory(command.Name)

	if err := h.categoryRepo.Save(ctx, category); err != nil {
		return "", err
	}

	return category.Id().Value(), nil
}
