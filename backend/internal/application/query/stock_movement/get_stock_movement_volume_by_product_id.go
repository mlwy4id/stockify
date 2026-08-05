package stockmovement

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetStockMovementVolumeByProductIDQuery struct {
	UserId    vo.UserId
	ProductId vo.ProductId
}

type GetStockMovementVolumeByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockMovementVolumeByProductIDHandler(productRepo repo.ProductRepository) *GetStockMovementVolumeByProductIDHandler {
	return &GetStockMovementVolumeByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockMovementVolumeByProductIDHandler) Handle(ctx context.Context, query GetStockMovementVolumeByProductIDQuery) (dto.StockMovementVolumeDTO, error) {
	product, err := h.productRepo.FindByID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.StockMovementVolumeDTO{}, err
	}

	movements, err := h.productRepo.GetStockMovementsByProductID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.StockMovementVolumeDTO{}, err
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

	result := make([]dto.StockMovementVolumeRangeDTO, 0, len(ranges))

	for _, r := range ranges {
		start := time.Time{}
		if r.filter != nil {
			start = now.Add(-r.filter.Duration())
		}

		totalIn, totalOut := totalInOut(movements, start, now)

		result = append(result, dto.StockMovementVolumeRangeDTO{
			Range:    r.key,
			TotalIn:  totalIn,
			TotalOut: totalOut,
		})
	}

	productId := product.Id().Value()
	productName := product.Name()

	return dto.StockMovementVolumeDTO{
		ProductId:   &productId,
		ProductName: &productName,
		Ranges:      result,
	}, nil
}

func enumFilter(f enum.DateFilter) *enum.DateFilter {
	return &f
}

func totalInOut(movements []*entity.StockMovement, start time.Time, end time.Time) (int, int) {
	totalIn, totalOut := 0, 0

	for _, m := range movements {
		if !start.IsZero() && m.Date().Before(start) {
			continue
		}

		if m.Date().After(end) {
			continue
		}

		qty := m.Quantity().Value()

		switch m.Action() {
		case enum.Restock, enum.Refund:
			totalIn += qty
		case enum.Sold, enum.Broken:
			totalOut += qty
		}
	}

	return totalIn, totalOut
}
