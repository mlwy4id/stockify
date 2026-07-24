package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/service"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type DeleteCategoryCommand struct {
	UserId vo.UserId
	Id     vo.CategoryId
}

type DeleteCategoryCommandHandler struct {
	categoryDeletionService service.CategoryDeletionService
}

func NewDeleteCategoryCommandHandler(categoryDeletionService service.CategoryDeletionService) *DeleteCategoryCommandHandler {
	return &DeleteCategoryCommandHandler{categoryDeletionService: categoryDeletionService}
}

func (h *DeleteCategoryCommandHandler) Handle(ctx context.Context, command DeleteCategoryCommand) error {
	return h.categoryDeletionService.DeleteCategoryWithCascade(ctx, command.UserId, command.Id)
}
