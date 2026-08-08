package stockmovement

import (
	"context"
	"sort"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetTopMoversQuery struct {
	UserId     vo.UserId
	Limit      int
	DateFilter *enum.DateFilter
}

type GetTopMoversHandler struct {
	productRepo repo.ProductRepository
}

func NewGetTopMoversHandler(productRepo repo.ProductRepository) *GetTopMoversHandler {
	return &GetTopMoversHandler{productRepo: productRepo}
}

func (h *GetTopMoversHandler) Handle(ctx context.Context, query GetTopMoversQuery) ([]dto.StockMovementSummaryDTO, error) {
	products, err := h.productRepo.FindAllActive(ctx, query.UserId)
	if err != nil {
		return nil, err
	}

	var movements []*entity.StockMovement
	now := time.Now()

	if query.DateFilter != nil && query.DateFilter.IsValid() {
		start, end := dateRangeFor(now, query.DateFilter)
		movements, err = h.productRepo.GetAllStockMovementsAndDateRange(ctx, query.UserId, start, end)
	} else {
		movements, err = h.productRepo.GetAllStockMovements(ctx, query.UserId)
	}

	if err != nil {
		return nil, err
	}

	productMap := make(map[vo.ProductId]*dto.StockMovementSummaryDTO)
	for _, p := range products {
		productMap[p.Id()] = &dto.StockMovementSummaryDTO{
			ProductId:   p.Id().Value(),
			ProductName: p.Name(),
		}
	}

	for _, m := range movements {
		ps, ok := productMap[m.ProductId()]
		if !ok {
			continue
		}
		qty := m.Quantity().Value()
		switch m.Action() {
		case enum.Restock, enum.Refund:
			ps.TotalIn += qty
		case enum.Sold, enum.Broken:
			ps.TotalOut += qty
		}
	}

	var results []dto.StockMovementSummaryDTO
	for _, ps := range productMap {
		results = append(results, *ps)
	}

	sort.Slice(results, func(i, j int) bool {
		return results[i].TotalOut > results[j].TotalOut
	})

	if query.Limit > 0 && query.Limit < len(results) {
		results = results[:query.Limit]
	}

	return results, nil
}
