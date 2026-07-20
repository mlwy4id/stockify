package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetCategoryByIDQuery struct {
	CategoryID vo.CategoryId
}

type GetCategoryByIDQueryHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewGetCategoryByIDQueryHandler(categoryRepo repo.CategoryRepository) *GetCategoryByIDQueryHandler {
	return &GetCategoryByIDQueryHandler{categoryRepo: categoryRepo}
}

func (h *GetCategoryByIDQueryHandler) Handle(ctx context.Context, query GetCategoryByIDQuery) (*dto.CategoryDTO, error) {
	category, err := h.categoryRepo.FindByID(ctx, query.CategoryID)
	if err != nil {
		return nil, err
	}

	return &dto.CategoryDTO{
		ID:   category.Id().Value(),
		Name: category.Name(),
	}, nil
}
