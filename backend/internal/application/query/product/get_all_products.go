package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetAllProductsStatus string

const (
	GetAllProductsStatusActive   GetAllProductsStatus = "active"
	GetAllProductsStatusArchived GetAllProductsStatus = "archived"
	GetAllProductsStatusAll      GetAllProductsStatus = "all"
)

func (s GetAllProductsStatus) IsValid() bool {
	switch s {
	case GetAllProductsStatusActive, GetAllProductsStatusArchived, GetAllProductsStatusAll:
		return true
	default:
		return false
	}
}

type GetAllProductsQuery struct {
	UserId vo.UserId
	Status GetAllProductsStatus
}

type GetAllProductsHandler struct {
	productRepo repo.ProductRepository
}

func NewGetAllProductsHandler(productRepo repo.ProductRepository) *GetAllProductsHandler {
	return &GetAllProductsHandler{productRepo: productRepo}
}

func (h *GetAllProductsHandler) Handle(ctx context.Context, query GetAllProductsQuery) ([]dto.ProductSummaryDTO, error) {
	var products []*entity.Product
	var err error

	switch query.Status {
	case GetAllProductsStatusArchived:
		products, err = h.productRepo.FindAllArchived(ctx, query.UserId)
	case GetAllProductsStatusAll:
		products, err = h.productRepo.FindAll(ctx, query.UserId)
	default:
		products, err = h.productRepo.FindAllActive(ctx, query.UserId)
	}

	if err != nil {
		return nil, err
	}

	var dtos []dto.ProductSummaryDTO
	for _, p := range products {
		var catId *string
		if c := p.CategoryId(); c != nil {
			v := c.Value()
			catId = &v
		}

		var imageUrl *string
		if url := p.ImageUrl(); url != "" {
			imageUrl = &url
		}

		dtos = append(dtos, dto.ProductSummaryDTO{
			ID:         p.Id().Value(),
			Name:       p.Name(),
			ImageUrl:   imageUrl,
			Quantity:   p.Quantity().Value(),
			CategoryId: catId,
			IsArchived: p.ArchivedAt() != nil,
		})
	}

	return dtos, nil
}