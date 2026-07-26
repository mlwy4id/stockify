package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetProductByIdQuery struct {
	UserId    vo.UserId
	ProductId vo.ProductId
}

type GetProductByIdHandler struct {
	productRepo repo.ProductRepository
}

func NewGetProductByIdHandler(productRepo repo.ProductRepository) *GetProductByIdHandler {
	return &GetProductByIdHandler{productRepo: productRepo}
}

func (h *GetProductByIdHandler) Handle(ctx context.Context, query GetProductByIdQuery) (*dto.ProductSummaryDTO, error) {
	p, err := h.productRepo.FindByID(ctx, query.UserId, query.ProductId)
	if err != nil {
		return nil, err
	}

	var catId *string
	if c := p.CategoryId(); c != nil {
		v := c.Value()
		catId = &v
	}

	return &dto.ProductSummaryDTO{
		ID:         p.Id().Value(),
		Name:       p.Name(),
		Quantity:   p.Quantity().Value(),
		CategoryId: catId,
	}, nil
}
