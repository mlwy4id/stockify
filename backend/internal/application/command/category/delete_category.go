package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/event"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type DeleteCategoryCommand struct {
	Id vo.CategoryId
}

type DeleteCategoryCommandHandler struct {
	categoryRepo repo.CategoryRepository
	productRepo  repo.ProductRepository
}

func NewDeleteCategoryCommandHandler(categoryRepo repo.CategoryRepository, productRepo repo.ProductRepository) *DeleteCategoryCommandHandler {
	return &DeleteCategoryCommandHandler{
		categoryRepo: categoryRepo,
		productRepo:  productRepo,
	}
}

func (h *DeleteCategoryCommandHandler) Handle(ctx context.Context, command DeleteCategoryCommand) error {
	category, err := h.categoryRepo.FindByID(ctx, command.Id)

	if err != nil {
		return err
	}

	if err := category.DeleteCategory(); err != nil {
		return err
	}

	if err := h.categoryRepo.Save(ctx, category); err != nil {
		return err
	}

	for _, e := range category.Events() {
		switch evnt := e.(type) {
		case event.CategoryDeleted:
			categoryId, _ := vo.ParseCategoryId(evnt.CategoryID)
			if err := h.productRepo.RemoveCategoryByCategoryId(ctx, categoryId); err != nil {
				return err
			}
		}
	}

	category.ClearEvents()
	return nil
}
