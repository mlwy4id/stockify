package product

import (
	"context"

	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type UpdateProductCommand struct {
	Id             vo.ProductId
	Name           *string
	StockThreshold *vo.StockThreshold
	CategoryId     *vo.CategoryId
}

type UpdateProductHandler struct {
	productRepo repo.ProductRepository
}

func NewUpdateProductHandler(productRepo repo.ProductRepository) *UpdateProductHandler {
	return &UpdateProductHandler{productRepo: productRepo}
}

func (h *UpdateProductHandler) Handle(ctx context.Context, command UpdateProductCommand) (string, error) {
	product, err := h.productRepo.FindByID(ctx, command.Id)

	if err != nil {
		return "", err
	}

	product.UpdateProduct(command.Name, command.StockThreshold, command.CategoryId)

	if err := h.productRepo.Save(ctx, product); err != nil {
		return "", err
	}

	return product.Id().Value(), nil
}
