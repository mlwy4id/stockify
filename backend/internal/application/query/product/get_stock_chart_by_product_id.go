package product

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

type GetStockChartByProductIDQuery struct {
	UserId     vo.UserId
	ProductId  vo.ProductId
	DateFilter *enum.DateFilter
}

type GetStockChartByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockChartByProductIDHandler(productRepo repo.ProductRepository) *GetStockChartByProductIDHandler {
	return &GetStockChartByProductIDHandler{productRepo: productRepo}
}

func (h *GetStockChartByProductIDHandler) Handle(ctx context.Context, query GetStockChartByProductIDQuery) (dto.StockChartDTO, error) {
	product, err := h.productRepo.FindByID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.StockChartDTO{}, err
	}

	now := time.Now()

	var movements []*entity.StockMovement
	start := time.Time{}

	if query.DateFilter != nil && query.DateFilter.IsValid() {
		start = now.Add(-query.DateFilter.Duration())
		movements, err = h.productRepo.GetStockMovementsByProductIDAndDateRange(ctx, query.UserId, query.ProductId, start, now)
	} else {
		movements, err = h.productRepo.GetStockMovementsByProductID(ctx, query.UserId, query.ProductId)
	}

	if err != nil {
		return dto.StockChartDTO{}, err
	}

	sort.Slice(movements, func(i, j int) bool {
		return movements[i].Date().Before(movements[j].Date())
	})

	totalQuantity := product.Quantity().Value()
	productId := product.Id().Value()
	productName := product.Name()

	if start.IsZero() {
		if len(movements) == 0 {
			return dto.StockChartDTO{
				ProductId:   &productId,
				ProductName: &productName,
				Points:      []dto.StockChartPointDTO{{Date: now, Quantity: totalQuantity}},
			}, nil
		}

		start = movements[0].Date()
	}

	startBalance := totalQuantity - netStockChange(movements)
	bucket := bucketSizeFor(now.Sub(start))
	points := buildChartPoints(start, now, startBalance, movements, bucket)

	return dto.StockChartDTO{
		ProductId:   &productId,
		ProductName: &productName,
		Points:      points,
	}, nil
}
