package category

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetAllCategoryQueryHandler struct {
	categoryRepo repo.CategoryRepository
}

func NewGetAllCategoryQueryHandler(categoryRepo repo.CategoryRepository) *GetAllCategoryQueryHandler {
	return &GetAllCategoryQueryHandler{categoryRepo: categoryRepo}
}

func (h *GetAllCategoryQueryHandler) Handle(ctx context.Context, userId vo.UserId) ([]dto.CategoryDTO, error) {
	categories, err := h.categoryRepo.FindAll(ctx, userId)
	if err != nil {
		return nil, err
	}

	var dtos []dto.CategoryDTO
	for _, c := range categories {
		dtos = append(dtos, dto.CategoryDTO{
			ID:   c.Id().Value(),
			Name: c.Name(),
		})
	}

	return dtos, nil
}
