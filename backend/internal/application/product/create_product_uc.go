package application

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CreateProductCommand struct {
	name           string
	quantity       vo.Quantity
	stockThreshold vo.StockThreshold
	categoryId     vo.CategoryId
}

type CreateProductUC struct {
	productRepo repo.ProductRepository
}

func NewCreateProductUC(productRepo repo.ProductRepository) *CreateProductUC {
	return &CreateProductUC{productRepo: productRepo}
}

func (uc *CreateProductUC) Execute(ctx context.Context, command CreateProductCommand) (string, error) {
	product, err := entity.NewProduct(command.name, command.quantity, command.stockThreshold, command.categoryId)

	if err != nil {
		return "", err
	}

	if err := uc.productRepo.Save(ctx, &product); err != nil {
		return "", err
	}

	return product.Id().Value(), nil
}
