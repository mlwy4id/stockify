package application

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
)

type CreateCategoryCommand struct {
	name string
}

type CreateCategoryUC struct {
	categoryRepo repo.CategoryRepository
}

func NewCreateCategoryUC(categoryRepo repo.CategoryRepository) *CreateCategoryUC {
	return &CreateCategoryUC{categoryRepo: categoryRepo}
}

func (uc *CreateCategoryUC) Execute(ctx context.Context, command CreateCategoryCommand) (string, error) {
	category, err := entity.NewCategory(command.name)

	if err != nil {
		return "", err
	}

	if err := uc.categoryRepo.Save(ctx, &category); err != nil {
		return "", err
	}

	return category.Id().Value(), nil
}
