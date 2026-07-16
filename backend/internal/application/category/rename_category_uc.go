package application

import (
	"context"
	"strings"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type RenameCategoryCommand struct {
	id   vo.CategoryId
	name string
}

type RenameCategoryUC struct {
	categoryRepo repo.CategoryRepository
}

func NewRenameCategoryUC(categoryRepo repo.CategoryRepository) *RenameCategoryUC {
	return &RenameCategoryUC{categoryRepo: categoryRepo}
}

func (uc *RenameCategoryUC) Execute(ctx context.Context, command RenameCategoryCommand) (string, error) {
	category, err := uc.categoryRepo.FindByID(ctx, command.id)

	if err != nil {
		return "", err
	}

	trimmedName := strings.TrimSpace(command.name)
	category.RenameCategory(trimmedName)

	if err := uc.categoryRepo.Save(ctx, category); err != nil {
		return "", err
	}

	return category.Id().Value(), nil
}
