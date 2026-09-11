package stockmovement

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetAllStockMovementsQuery struct {
	UserId vo.UserId
	Start  *time.Time
	End    *time.Time
}

type GetAllStockMovementsHandler struct {
	productRepo repo.ProductRepository
}

func NewGetAllStockMovementsHandler(productRepo repo.ProductRepository) *GetAllStockMovementsHandler {
	return &GetAllStockMovementsHandler{productRepo: productRepo}
}

func (h *GetAllStockMovementsHandler) Handle(ctx context.Context, query GetAllStockMovementsQuery) ([]dto.StockMovementDTO, error) {
	var movements []*entity.StockMovement
	var err error

	if query.Start != nil && query.End != nil {
		movements, err = h.productRepo.GetAllStockMovementsAndDateRange(ctx, query.UserId, *query.Start, *query.End)
	} else {
		movements, err = h.productRepo.GetAllStockMovements(ctx, query.UserId)
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
