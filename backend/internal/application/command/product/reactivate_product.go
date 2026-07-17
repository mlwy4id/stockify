package product

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ReactivateProductCommand struct {
	Id vo.ProductId
}

type ReactivateProductHandler struct {
	productRepo repo.ProductRepository
}

func NewReactivateProductHandler(productRepo repo.ProductRepository) *ReactivateProductHandler {
	return &ReactivateProductHandler{productRepo: productRepo}
}

func (h *ReactivateProductHandler) Handle(ctx context.Context, command ReactivateProductCommand) error {
	product, err := h.productRepo.FindByID(ctx, command.Id)

	if err != nil {
		return err
	}

	product.ReactivateProduct()

	if err := h.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
