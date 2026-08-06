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

type GetStockDepletionPredictionByProductIDQuery struct {
	UserId    vo.UserId
	ProductId vo.ProductId
}

type GetStockDepletionPredictionByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockDepletionPredictionByProductIDHandler(productRepo repo.ProductRepository) *GetStockDepletionPredictionByProductIDHandler {
	return &GetStockDepletionPredictionByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockDepletionPredictionByProductIDHandler) Handle(ctx context.Context, query GetStockDepletionPredictionByProductIDQuery) (dto.StockDepletionPredictionDTO, error) {
	product, err := h.productRepo.FindByID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.StockDepletionPredictionDTO{}, err
	}

	movements, err := h.productRepo.GetStockMovementsByProductID(ctx, query.UserId, query.ProductId, false)
	if err != nil {
		return dto.StockDepletionPredictionDTO{}, err
	}

	now := time.Now()
	window := enum.Filter1m.Duration()

	totalOut := totalOutflowWindow(movements, now, window)
	if totalOut == 0 {
		return dto.StockDepletionPredictionDTO{}, nil
	}

	avgDailyOut := float64(totalOut) / (window.Hours() / 24)
	daysLeft := int(math.Ceil(float64(product.Quantity().Value()) / avgDailyOut))
	estimatedDate := now.Add(time.Duration(daysLeft) * 24 * time.Hour)

	result := dto.StockDepletionPredictionDTO{
		AvgDailyOut:   &avgDailyOut,
		DaysLeft:      &daysLeft,
		EstimatedDate: &estimatedDate,
	}

	return result, nil
}

func totalOutflowWindow(movements []*entity.StockMovement, now time.Time, window time.Duration) int {
	start := now.Add(-window)
	total := 0

	for _, m := range movements {
		if m.Date().Before(start) || m.Date().After(now) {
			continue
		}

		switch m.Action() {
		case enum.Sold, enum.Broken:
			total += m.Quantity().Value()
		}
	}

	return total
}
