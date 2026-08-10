package stockmovement

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetDashboardStockMovementSummaryQuery struct {
	UserId vo.UserId
}

type GetDashboardStockMovementSummaryHandler struct {
	productRepo repo.ProductRepository
}

func NewGetDashboardStockMovementSummaryHandler(productRepo repo.ProductRepository) *GetDashboardStockMovementSummaryHandler {
	return &GetDashboardStockMovementSummaryHandler{productRepo: productRepo}
}

func (h *GetDashboardStockMovementSummaryHandler) Handle(ctx context.Context, query GetDashboardStockMovementSummaryQuery) (dto.DashboardStockMovementSummaryDTO, error) {
	products, err := h.productRepo.FindAllActive(ctx, query.UserId)
	if err != nil {
		return dto.DashboardStockMovementSummaryDTO{}, err
	}

	filter := enum.Filter1d
	now := time.Now()
	summary := dto.DashboardStockMovementSummaryDTO{
		TotalActiveProduct: len(products),
	}

	for _, p := range products {
		summary.TotalQuantity += p.Quantity().Value()
	}

	start, end := dateRangeFor(now, &filter)
	period := end.Sub(start)
	prevStart := start.Add(-period)
	prevEnd := start

	currentIn, currentOut, err := h.sumInOut(ctx, query.UserId, start, end)
	if err != nil {
		return dto.DashboardStockMovementSummaryDTO{}, err
	}

	prevIn, prevOut, err := h.sumInOut(ctx, query.UserId, prevStart, prevEnd)
	if err != nil {
		return dto.DashboardStockMovementSummaryDTO{}, err
	}

	summary.TotalIn = currentIn
	summary.TotalOut = currentOut
	summary.InChangePercentage = percentageChange(prevIn, currentIn)
	summary.OutChangePercentage = percentageChange(prevOut, currentOut)

	return summary, nil
}

func (h *GetDashboardStockMovementSummaryHandler) sumInOut(ctx context.Context, userId vo.UserId, start time.Time, end time.Time) (int, int, error) {
	movements, err := h.productRepo.GetAllStockMovementsAndDateRange(ctx, userId, start, end)
	if err != nil {
		return 0, 0, err
	}

	var totalIn, totalOut int

	for _, m := range movements {
		qty := m.Quantity().Value()

		switch m.Action() {
		case enum.Restock, enum.Refund:
			totalIn += qty
		case enum.Sold, enum.Broken:
			totalOut += qty
		}
	}

	return totalIn, totalOut, nil
}
