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

type GetStockMovementSoldBrokenRatioByProductIDQuery struct {
	UserId    vo.UserId
	ProductId vo.ProductId
}

type GetStockMovementSoldBrokenRatioByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockMovementSoldBrokenRatioByProductIDHandler(productRepo repo.ProductRepository) *GetStockMovementSoldBrokenRatioByProductIDHandler {
	return &GetStockMovementSoldBrokenRatioByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockMovementSoldBrokenRatioByProductIDHandler) Handle(ctx context.Context, query GetStockMovementSoldBrokenRatioByProductIDQuery) (dto.StockMovementSoldBrokenRatioDTO, error) {
	product, err := h.productRepo.FindByID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.StockMovementSoldBrokenRatioDTO{}, err
	}

	movements, err := h.productRepo.GetStockMovementsByProductID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.StockMovementSoldBrokenRatioDTO{}, err
	}

	now := time.Now()

	ranges := []struct {
		key    string
		filter *enum.DateFilter
	}{
		{"1w", enumFilter(enum.Filter1w)},
		{"1m", enumFilter(enum.Filter1m)},
		{"3m", enumFilter(enum.Filter3m)},
		{"6m", enumFilter(enum.Filter6m)},
		{"1y", enumFilter(enum.Filter1y)},
		{"all", nil},
	}

	result := make([]dto.StockMovementSoldBrokenRatioRangeDTO, 0, len(ranges))

	for _, r := range ranges {
		start := time.Time{}
		if r.filter != nil {
			start = now.Add(-r.filter.Duration())
		}

		totalSold, totalBroken := totalSoldBroken(movements, start, now)
		totalOut := totalSold + totalBroken

		soldPercentage, brokenPercentage := 0.0, 0.0
		if totalOut > 0 {
			soldPercentage = roundPercentage(float64(totalSold) / float64(totalOut) * 100)
			brokenPercentage = roundPercentage(float64(totalBroken) / float64(totalOut) * 100)
		}

		result = append(result, dto.StockMovementSoldBrokenRatioRangeDTO{
			Range:            r.key,
			TotalSold:        totalSold,
			TotalBroken:      totalBroken,
			SoldPercentage:   soldPercentage,
			BrokenPercentage: brokenPercentage,
		})
	}

	productId := product.Id().Value()
	productName := product.Name()

	return dto.StockMovementSoldBrokenRatioDTO{
		ProductId:   &productId,
		ProductName: &productName,
		Ranges:      result,
	}, nil
}

func totalSoldBroken(movements []*entity.StockMovement, start time.Time, end time.Time) (int, int) {
	totalSold, totalBroken := 0, 0

	for _, m := range movements {
		if !start.IsZero() && m.Date().Before(start) {
			continue
		}

		if m.Date().After(end) {
			continue
		}

		qty := m.Quantity().Value()

		switch m.Action() {
		case enum.Sold:
			totalSold += qty
		case enum.Broken:
			totalBroken += qty
		}
	}

	return totalSold, totalBroken
}

func roundPercentage(value float64) float64 {
	return math.Round(value*100) / 100
}
