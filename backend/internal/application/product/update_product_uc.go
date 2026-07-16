package application

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type UpdateProductCommand struct {
	id             vo.ProductId
	name           *string
	stockThreshold *vo.StockThreshold
	categoryId     *vo.CategoryId
}

type UpdateProductUC struct {
	productRepo repo.ProductRepository
}

func NewUpdateProductUC(productRepo repo.ProductRepository) *UpdateProductUC {
	return &UpdateProductUC{productRepo: productRepo}
}

func (uc *UpdateProductUC) Execute(ctx context.Context, command UpdateProductCommand) (string, error) {
	product, err := uc.productRepo.FindByID(ctx, command.id)

	if err != nil {
		return "", err
	}

	product.UpdateProduct(command.name, command.stockThreshold, command.categoryId)

	if err := uc.productRepo.Save(ctx, product); err != nil {
		return "", err
	}

	return product.Id().Value(), nil
}
