package product

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ArchiveProductCommand struct {
	Id vo.ProductId
}

type ArchiveProductHandler struct {
	productRepo repo.ProductRepository
}

func NewArchiveProductHandler(productRepo repo.ProductRepository) *ArchiveProductHandler {
	return &ArchiveProductHandler{productRepo: productRepo}
}

func (h *ArchiveProductHandler) Handle(ctx context.Context, command ArchiveProductCommand) error {
	product, err := h.productRepo.FindByID(ctx, command.Id)

	if err != nil {
		return err
	}

	product.ArchiveProduct()

	if err := h.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
