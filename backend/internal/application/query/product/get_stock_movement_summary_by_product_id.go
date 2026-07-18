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

type GetStockMovementSummaryByProductIDQuery struct {
	ProductId  vo.ProductId
	DateFilter *enum.DateFilter
}

type GetStockMovementSummaryByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockMovementSummaryByProductIDHandler(productRepo repo.ProductRepository) *GetStockMovementSummaryByProductIDHandler {
	return &GetStockMovementSummaryByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockMovementSummaryByProductIDHandler) Handle(ctx context.Context, query GetStockMovementSummaryByProductIDQuery) (dto.StockMovementSummaryDTO, error) {
	product, err := h.productRepo.FindByID(ctx, query.ProductId)
	if err != nil {
		return dto.StockMovementSummaryDTO{}, err
	}

	var movements []*entity.StockMovement
	now := time.Now()

	if query.DateFilter != nil && query.DateFilter.IsValid() {
		start := now.Add(-query.DateFilter.Duration())
		movements, err = h.productRepo.GetStockMovementsByProductIDAndDateRange(ctx, query.ProductId, start, now)
	} else {
		movements, err = h.productRepo.GetStockMovementsByProductID(ctx, query.ProductId)
	}

	if err != nil {
		return dto.StockMovementSummaryDTO{}, err
	}

	summary := dto.StockMovementSummaryDTO{
		ProductId:   product.Id().Value(),
		ProductName: product.Name(),
	}

	for _, m := range movements {
		qty := m.Quantity().Value()
		switch m.Action() {
		case enum.Restock, enum.Refund:
			summary.TotalIn += qty
		case enum.Sold, enum.Broken:
			summary.TotalOut += qty
		}
	}

	return summary, nil
}
