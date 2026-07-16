package application

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ArchiveProductCommand struct {
	id vo.ProductId
}

type ArchiveProductUC struct {
	productRepo repo.ProductRepository
}

func NewArchiveProductUC(productRepo repo.ProductRepository) *ArchiveProductUC {
	return &ArchiveProductUC{productRepo: productRepo}
}

func (uc *ArchiveProductUC) Execute(ctx context.Context, command ArchiveProductCommand) error {
	product, err := uc.productRepo.FindByID(ctx, command.id)

	if err != nil {
		return err
	}

	product.ArchiveProduct()

	if err := uc.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
