package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/service"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type DeleteCategoryCommand struct {
	Id vo.CategoryId
}

type DeleteCategoryCommandHandler struct {
	categoryDeletionService service.CategoryDeletionService
}

func NewDeleteCategoryCommandHandler(categoryDeletionService service.CategoryDeletionService) *DeleteCategoryCommandHandler {
	return &DeleteCategoryCommandHandler{categoryDeletionService: categoryDeletionService}
}

func (h *DeleteCategoryCommandHandler) Handle(ctx context.Context, command DeleteCategoryCommand) error {
	categoryId, err := vo.ParseCategoryId(command.Id.Value())
	if err != nil {
		return err
	}

	return h.categoryDeletionService.DeleteCategoryWithCascade(ctx, categoryId)
}
