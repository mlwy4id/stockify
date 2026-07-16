package application

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetProductByCategoryQuery struct {
	categoryId vo.CategoryId
}

type GetProductByCategoryUC struct {
	productRepo repo.ProductRepository
}

func NewGetProductByCategoryUC(productRepo repo.ProductRepository) *GetProductByCategoryUC {
	return &GetProductByCategoryUC{productRepo: productRepo}
}

func (uc *GetProductByCategoryUC) Execute(ctx context.Context, query GetProductByCategoryQuery) ([]ProductSummaryDTO, error) {
	products, err := uc.productRepo.FindByCategoryID(ctx, query.categoryId)

	if err != nil {
		return []ProductSummaryDTO{}, err
	}

	var dtos []ProductSummaryDTO
	for _, p := range products {
		dtos = append(dtos, ProductSummaryDTO{
			ID:         p.Id().Value(),
			Name:       p.Name(),
			Quantity:   p.Quantity().Value(),
			CategoryId: p.CategoryId().Value(),
		})
	}

	return dtos, nil
}
