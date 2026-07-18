package product

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetStockMovementByProductIDQuery struct {
	ProductId vo.ProductId
	Start     *time.Time
	End       *time.Time
}

type GetStockMovementByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockMovementByProductIDHandler(productRepo repo.ProductRepository) *GetStockMovementByProductIDHandler {
	return &GetStockMovementByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockMovementByProductIDHandler) Handle(ctx context.Context, query GetStockMovementByProductIDQuery) ([]dto.StockMovementDTO, error) {
	var movements []*entity.StockMovement
	var err error

	if query.Start != nil && query.End != nil {
		movements, err = h.productRepo.GetStockMovementsByProductIDAndDateRange(ctx, query.ProductId, *query.Start, *query.End)
	} else {
		movements, err = h.productRepo.GetStockMovementsByProductID(ctx, query.ProductId)
	}

	if err != nil {
		return []dto.StockMovementDTO{}, err
	}

	var dtos []dto.StockMovementDTO
	for _, m := range movements {
		d := dto.StockMovementDTO{
			ID:       m.Id().Value(),
			Action:   m.Action().String(),
			Quantity: m.Quantity().Value(),
			Date:     m.Date(),
		}

		if m.Source() != nil {
			d.Source = *m.Source()
		}

		if m.Reason() != nil {
			d.Reason = *m.Reason()
		}

		dtos = append(dtos, d)
	}

	return dtos, nil
}
