package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetLowStockProductsHandler struct {
	productRepo repo.ProductRepository
}

func NewGetLowStockProductsHandler(productRepo repo.ProductRepository) *GetLowStockProductsHandler {
	return &GetLowStockProductsHandler{productRepo: productRepo}
}

func (h *GetLowStockProductsHandler) Handle(ctx context.Context, userId vo.UserId) ([]dto.ProductSummaryDTO, error) {
	products, err := h.productRepo.FindAllActive(ctx, userId)
	if err != nil {
		return nil, err
	}

	var results []dto.ProductSummaryDTO
	for _, p := range products {
		if p.Quantity().Value() < p.StockThreshold().Value() {
			var catId *string
			if c := p.CategoryId(); c != nil {
				v := c.Value()
				catId = &v
			}

			var imageUrl *string
			if url := p.ImageUrl(); url != "" {
				imageUrl = &url
			}

			results = append(results, dto.ProductSummaryDTO{
				ID:         p.Id().Value(),
				Name:       p.Name(),
				ImageUrl:   imageUrl,
				Quantity:   p.Quantity().Value(),
				CategoryId: catId,
			})
		}
	}

	return results, nil
}
