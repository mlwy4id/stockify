package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CreateProductCommand struct {
	Name           string
	Quantity       vo.Quantity
	StockThreshold vo.StockThreshold
	CategoryId     vo.CategoryId
}

type CreateProductHandler struct {
	productRepo repo.ProductRepository
}

func NewCreateProductHandler(productRepo repo.ProductRepository) *CreateProductHandler {
	return &CreateProductHandler{productRepo: productRepo}
}

func (h *CreateProductHandler) Handle(ctx context.Context, command CreateProductCommand) (string, error) {
	product, err := entity.NewProduct(command.Name, command.Quantity, command.StockThreshold, command.CategoryId)

	if err != nil {
		return "", err
	}

	if err := h.productRepo.Save(ctx, &product); err != nil {
		return "", err
	}

	return product.Id().Value(), nil
}
