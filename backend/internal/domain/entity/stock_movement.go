package entity

import (
	"errors"
	"strings"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type StockMovement struct {
	id       vo.StockMovementId
	action   enum.Action
	quantity vo.Quantity
	source   *string
	reason   *string
	date     time.Time
}

func NewStockMovement(action enum.Action, quantity vo.Quantity, source string, reason string, date time.Time) (StockMovement, error) {
	if !action.IsValid() {
		return StockMovement{}, errors.New("action is not valid")
	}

	sm := StockMovement{
		id:       vo.NewStockMovementId(),
		action:   action,
		quantity: quantity,
		date:     date,
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
