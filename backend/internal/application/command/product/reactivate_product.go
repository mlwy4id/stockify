package product

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ReactivateProductCommand struct {
	UserId vo.UserId
	Id     vo.ProductId
}

type ReactivateProductCommandHandler struct {
	productRepo repo.ProductRepository
}

func NewReactivateProductCommandHandler(productRepo repo.ProductRepository) *ReactivateProductCommandHandler {
	return &ReactivateProductCommandHandler{productRepo: productRepo}
}

func (h *ReactivateProductCommandHandler) Handle(ctx context.Context, command ReactivateProductCommand) error {
	product, err := h.productRepo.FindByID(ctx, command.UserId, command.Id)

	if err != nil {
		return err
	}

	if err := product.ReactivateProduct(); err != nil {
		return err
	}

	if err := h.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
