package product

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	stockmovement "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetProductDashboardByProductIDQuery struct {
	UserId    vo.UserId
	ProductId vo.ProductId
}

type GetProductDashboardByProductIDHandler struct {
	productRepo repo.ProductRepository
}

func NewGetProductDashboardByProductIDHandler(productRepo repo.ProductRepository) *GetProductDashboardByProductIDHandler {
	return &GetProductDashboardByProductIDHandler{productRepo: productRepo}
}

func (h *GetProductDashboardByProductIDHandler) Handle(ctx context.Context, query GetProductDashboardByProductIDQuery) (dto.ProductDashboardDTO, error) {
	product, err := h.productRepo.FindByID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return dto.ProductDashboardDTO{}, err
	}

	movements, err := h.productRepo.GetStockMovementsByProductID(ctx, query.UserId, query.ProductId, true)
	if err != nil {
		return dto.ProductDashboardDTO{}, err
	}

	now := time.Now()

	productId := product.Id().Value()
	productName := product.Name()

	var stockThreshold *int
	threshold := product.StockThreshold().Value()
	if threshold != 0 {
		stockThreshold = &threshold
	}

	var categoryId *string
	if c := product.CategoryId(); c != nil {
		v := c.Value()
		categoryId = &v
	}

	var imageUrl *string
	if url := product.ImageUrl(); url != "" {
		imageUrl = &url
	}

	return dto.ProductDashboardDTO{
		ProductId:       &productId,
		ProductName:     &productName,
		ImageUrl:        imageUrl,
		CurrentStock:    product.Quantity().Value(),
		StockThreshold:  stockThreshold,
		CategoryId:      categoryId,
		Volume:          stockmovement.TotalInOutAll(movements, now),
		Ratio:           stockmovement.TotalSoldBrokenAll(movements, now),
		Depletion:       stockmovement.ComputeDepletion(product.Quantity().Value(), movements, now),
		RestockInterval: stockmovement.ComputeRestockInterval(movements, now),
	}, nil
}
