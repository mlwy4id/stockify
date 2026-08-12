package product

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CreateProductCommand struct {
	UserId         vo.UserId
	Name           string
	ImageUrl       string
	Quantity       vo.Quantity
	StockThreshold vo.StockThreshold
	CategoryId     *vo.CategoryId
}

type CreateProductCommandHandler struct {
	productRepo repo.ProductRepository
}

func NewCreateProductCommandHandler(productRepo repo.ProductRepository) *CreateProductCommandHandler {
	return &CreateProductCommandHandler{productRepo: productRepo}
}

func (h *CreateProductCommandHandler) Handle(ctx context.Context, command CreateProductCommand) (string, error) {
	product, err := entity.NewProduct(command.UserId, command.Name, command.ImageUrl, command.Quantity, command.StockThreshold, command.CategoryId)

	if err != nil {
		return "", err
	}

	if err := h.productRepo.Save(ctx, &product); err != nil {
		return "", err
	}

	return product.Id().Value(), nil
}
