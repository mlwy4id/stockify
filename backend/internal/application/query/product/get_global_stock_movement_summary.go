package product

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetGlobalStockMovementSummaryQuery struct {
	DateFilter *enum.DateFilter
}

type GetGlobalStockMovementSummaryHandler struct {
	productRepo repo.ProductRepository
}

func NewGetGlobalStockMovementSummaryHandler(productRepo repo.ProductRepository) *GetGlobalStockMovementSummaryHandler {
	return &GetGlobalStockMovementSummaryHandler{productRepo: productRepo}
}

func (h *GetGlobalStockMovementSummaryHandler) Handle(ctx context.Context, query GetGlobalStockMovementSummaryQuery) (dto.GlobalStockMovementSummaryDTO, error) {
	products, err := h.productRepo.FindAllActive(ctx)
	if err != nil {
		return dto.GlobalStockMovementSummaryDTO{}, err
	}

	summary := dto.GlobalStockMovementSummaryDTO{}
	productSummaries := make(map[vo.ProductId]*dto.StockMovementSummaryDTO)

	for _, p := range products {
		productSummaries[p.Id()] = &dto.StockMovementSummaryDTO{
			ProductId:   p.Id().Value(),
			ProductName: p.Name(),
		}
	}

	var movements []*entity.StockMovement
	now := time.Now()

	if query.DateFilter != nil && query.DateFilter.IsValid() {
		start := now.Add(-query.DateFilter.Duration())
		movements, err = h.productRepo.GetAllStockMovementsAndDateRange(ctx, start, now)
	} else {
		movements, err = h.productRepo.GetAllStockMovements(ctx)
	}

	if err != nil {
		return dto.GlobalStockMovementSummaryDTO{}, err
	}

	for _, m := range movements {
		qty := m.Quantity().Value()

		if ps, ok := productSummaries[m.ProductId()]; ok {
			switch m.Action() {
			case enum.Restock, enum.Refund:
				summary.TotalIn += qty
				ps.TotalIn += qty
			case enum.Sold, enum.Broken:
				summary.TotalOut += qty
				ps.TotalOut += qty
			}
		}
	}

	for _, s := range productSummaries {
		summary.ProductSummaries = append(summary.ProductSummaries, *s)
	}

	return summary, nil
}
