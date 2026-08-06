package stockmovement

import (
	"context"
	"math"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetStockRestockIntervalByProductIDQuery struct {
	UserId    vo.UserId
	ProductId vo.ProductId
}

type GetStockRestockIntervalByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockRestockIntervalByProductIDHandler(productRepo repo.ProductRepository) *GetStockRestockIntervalByProductIDHandler {
	return &GetStockRestockIntervalByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockRestockIntervalByProductIDHandler) Handle(ctx context.Context, query GetStockRestockIntervalByProductIDQuery) (dto.StockRestockIntervalDTO, error) {
	movements, err := h.productRepo.GetStockMovementsByProductID(ctx, query.UserId, query.ProductId, true)
	if err != nil {
		return dto.StockRestockIntervalDTO{}, err
	}

	dates := restockDatesInWindow(movements, time.Now(), enum.Filter1y.Duration())
	result := dto.StockRestockIntervalDTO{
		RestockCount: len(dates),
	}

	if len(dates) < 2 {
		return result, nil
	}

	totalGapDays := 0.0
	for i := 1; i < len(dates); i++ {
		totalGapDays += dates[i].Sub(dates[i-1]).Hours() / 24
	}

	avg := math.Round((totalGapDays/float64(len(dates)-1))*10) / 10
	result.AvgRestockIntervalDays = &avg

	return result, nil
}

func restockDatesInWindow(movements []*entity.StockMovement, now time.Time, window time.Duration) []time.Time {
	start := now.Add(-window)
	dates := make([]time.Time, 0)

	for _, m := range movements {
		if m.Action() != enum.Restock {
			continue
		}

		d := m.Date()
		if d.Before(start) || d.After(now) {
			continue
		}

		dates = append(dates, d)
	}

	return dates
}
