package entity

import (
	"errors"
	"strings"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type StockMovement struct {
	id             vo.StockMovementId
	userId         vo.UserId
	productId      vo.ProductId
	action         enum.Action
	quantity       vo.Quantity
	productBalance vo.Quantity
	source         *string
	reason         *string
	date           time.Time
}

func NewStockMovement(userId vo.UserId, productId vo.ProductId, action enum.Action, quantity vo.Quantity, productBalance vo.Quantity, source string, reason string, date time.Time) (StockMovement, error) {
	if !action.IsValid() {
		return StockMovement{}, errors.New("action is not valid")
	}

	sm := StockMovement{
		id:             vo.NewStockMovementId(),
		userId:         userId,
		productId:      productId,
		action:         action,
		quantity:       quantity,
		productBalance: productBalance,
		date:           date,
	}

	trimmedSource := strings.TrimSpace(source)
	trimmedReason := strings.TrimSpace(reason)

	if trimmedSource != "" {
		sm.source = &trimmedSource
	}

	if trimmedReason != "" {
		sm.reason = &trimmedReason
	}

	return sm, nil
}

func (s StockMovement) Id() vo.StockMovementId {
	return s.id
}

func (s StockMovement) UserId() vo.UserId {
	return s.userId
}

func (s StockMovement) ProductId() vo.ProductId {
	return s.productId
}

func (s StockMovement) Action() enum.Action {
	return s.action
}

func (s StockMovement) Quantity() vo.Quantity {
	return s.quantity
}

func (s StockMovement) ProductBalance() vo.Quantity {
	return s.productBalance
}

func (s StockMovement) Source() *string {
	return s.source
}

func (s StockMovement) Reason() *string {
	return s.reason
}

func (s StockMovement) Date() time.Time {
	return s.date
}

func ReconstructStockMovement(id vo.StockMovementId, userId vo.UserId, productId vo.ProductId, action string, quantity int, productBalance int, source *string, reason *string, date time.Time) StockMovement {
	return StockMovement{
		id:             id,
		userId:         userId,
		productId:      productId,
		action:         enum.Action(action),
		quantity:       vo.ReconstructQuantity(quantity),
		productBalance: vo.ReconstructQuantity(productBalance),
		source:         source,
		reason:         reason,
		date:           date,
	}
}
