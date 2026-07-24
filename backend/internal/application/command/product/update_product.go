package product

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type UpdateProductCommand struct {
	UserId         vo.UserId
	Id             vo.ProductId
	Name           *string
	StockThreshold *vo.StockThreshold
	CategoryId     *vo.CategoryId
}

type UpdateProductCommandHandler struct {
	productRepo repo.ProductRepository
}

func NewUpdateProductCommandHandler(productRepo repo.ProductRepository) *UpdateProductCommandHandler {
	return &UpdateProductCommandHandler{productRepo: productRepo}
}

func (h *UpdateProductCommandHandler) Handle(ctx context.Context, command UpdateProductCommand) (string, error) {
	product, err := h.productRepo.FindByID(ctx, command.UserId, command.Id)

	if err != nil {
		return "", err
	}

	product.UpdateProduct(command.Name, command.StockThreshold, command.CategoryId)

	if err := h.productRepo.Save(ctx, product); err != nil {
		return "", err
	}

	return product.Id().Value(), nil
}
