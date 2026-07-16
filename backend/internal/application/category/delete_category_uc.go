package application

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type DeleteCategoryCommand struct {
	id vo.CategoryId
}

type DeleteCategoryUC struct {
	categoryRepo repo.CategoryRepository
}

func NewDeleteCategoryUC(categoryRepo repo.CategoryRepository) *DeleteCategoryUC {
	return &DeleteCategoryUC{categoryRepo: categoryRepo}
}

func (uc *DeleteCategoryUC) Execute(ctx context.Context, command DeleteCategoryCommand) error {
	category, err := uc.categoryRepo.FindByID(ctx, command.id)

	if err != nil {
		return err
	}

	category.DeleteCategory()

	if err := uc.categoryRepo.Save(ctx, category); err != nil {
		return err
	}

	return nil
}
