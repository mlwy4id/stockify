package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetProductByCategoryQuery struct {
	UserId     vo.UserId
	CategoryId vo.CategoryId
}

type GetProductByCategoryHandler struct {
	productRepo repo.ProductRepository
}

func NewGetProductByCategoryHandler(productRepo repo.ProductRepository) *GetProductByCategoryHandler {
	return &GetProductByCategoryHandler{productRepo: productRepo}
}

func (h *GetProductByCategoryHandler) Handle(ctx context.Context, query GetProductByCategoryQuery) ([]dto.ProductSummaryDTO, error) {
	products, err := h.productRepo.FindByCategoryID(ctx, query.UserId, query.CategoryId)

	if err != nil {
		return []dto.ProductSummaryDTO{}, err
	}

	var dtos []dto.ProductSummaryDTO
	for _, p := range products {
		var catId *string
		if c := p.CategoryId(); c != nil {
			v := c.Value()
			catId = &v
		}
		dtos = append(dtos, dto.ProductSummaryDTO{
			ID:         p.Id().Value(),
			Name:       p.Name(),
			Quantity:   p.Quantity().Value(),
			CategoryId: catId,
		})
	}

	return dtos, nil
}
