package product

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CreateStockMovementCommand struct {
	UserId    vo.UserId
	ProductId vo.ProductId
	Action    enum.Action
	Quantity  vo.Quantity
	Source    string
	Reason    string
	Date      time.Time
}

type CreateStockMovementCommandHandler struct {
	productRepo repo.ProductRepository
}

func NewCreateStockMovementCommandHandler(productRepo repo.ProductRepository) *CreateStockMovementCommandHandler {
	return &CreateStockMovementCommandHandler{productRepo: productRepo}
}

func (h *CreateStockMovementCommandHandler) Handle(ctx context.Context, command CreateStockMovementCommand) error {
	product, err := h.productRepo.FindByID(ctx, command.UserId, command.ProductId)

	if err != nil {
		return err
	}

	if err := product.AddStockMovement(command.Action, command.Quantity, command.Source, command.Reason, command.Date); err != nil {
		return err
	}

	if err := h.productRepo.Save(ctx, product); err != nil {
		return err
	}

	return nil
}
