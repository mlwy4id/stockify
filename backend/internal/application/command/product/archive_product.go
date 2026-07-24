package product

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ArchiveProductCommand struct {
	UserId vo.UserId
	Id     vo.ProductId
}

type ArchiveProductCommandHandler struct {
	productRepo repo.ProductRepository
}

func NewArchiveProductCommandHandler(productRepo repo.ProductRepository) *ArchiveProductCommandHandler {
	return &ArchiveProductCommandHandler{productRepo: productRepo}
}

func (h *ArchiveProductCommandHandler) Handle(ctx context.Context, command ArchiveProductCommand) error {
	product, err := h.productRepo.FindByID(ctx, command.UserId, command.Id)

	if err != nil {
		return err
	}

	if err := product.ArchiveProduct(); err != nil {
		return err
	}

	if err := h.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
