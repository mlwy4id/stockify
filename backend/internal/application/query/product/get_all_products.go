package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetAllProductsHandler struct {
	productRepo repo.ProductRepository
}

func NewGetAllProductsHandler(productRepo repo.ProductRepository) *GetAllProductsHandler {
	return &GetAllProductsHandler{productRepo: productRepo}
}

func (h *GetAllProductsHandler) Handle(ctx context.Context, userId vo.UserId) ([]dto.ProductSummaryDTO, error) {
	products, err := h.productRepo.FindAllActive(ctx, userId)
	if err != nil {
		return nil, err
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
