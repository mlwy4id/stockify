package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetStockMovementByProductIDQuery struct {
	ProductId vo.ProductId
}

type GetStockMovementByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockMovementByProductIDHandler(productRepo repo.ProductRepository) *GetStockMovementByProductIDHandler {
	return &GetStockMovementByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockMovementByProductIDHandler) Handle(ctx context.Context, query GetStockMovementByProductIDQuery) ([]dto.StockMovementDTO, error) {
 stockMovements, err := h.productRepo.GetStockMovementsByProductID(ctx, query.ProductId)

	if err != nil {
		return []dto.StockMovementDTO{}, err
	}

	var dtos []dto.StockMovementDTO
	for _, sm := range stockMovements {
		d := dto.StockMovementDTO{
			ID:       sm.Id().Value(),
			Action:   sm.Action().String(),
			Quantity: sm.Quantity().Value(),
			Date:     sm.Date(),
		}

		if sm.Source() != nil {
			d.Source = *sm.Source()
		}

		if sm.Reason() != nil {
			d.Reason = *sm.Reason()
		}

		dtos = append(dtos, d)
	}

	return dtos, nil
}
