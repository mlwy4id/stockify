package application

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ReactivateProductCommand struct {
	id vo.ProductId
}

type ReactivateProductUC struct {
	productRepo repo.ProductRepository
}

func NewReactivateProductUC(productRepo repo.ProductRepository) *ReactivateProductUC {
	return &ReactivateProductUC{productRepo: productRepo}
}

func (uc *ReactivateProductUC) Execute(ctx context.Context, command ReactivateProductCommand) error {
	product, err := uc.productRepo.FindByID(ctx, command.id)

	if err != nil {
		return err
	}

	product.ReactivateProduct()

	if err := uc.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
