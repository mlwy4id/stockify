package entity

import (
	"errors"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	valueobject "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type StockMovement struct {
	id       valueobject.StockMovementId
	action   enum.Action
	quantity valueobject.Quantity
	source   *string
	reason   *string
	date     time.Time
}

func NewStockMovement(action enum.Action, quantity valueobject.Quantity, source string, reason string, date time.Time) (StockMovement, error) {
	if !action.IsValid() {
		return StockMovement{}, errors.New("action is not valid")
	}

	sm := StockMovement{
		id:       valueobject.NewStockMovementId(),
		action:   action,
		quantity: quantity,
		date:     date,
	}

	if source != "" {
		sm.source = &source
	}

	if reason != "" {
		sm.reason = &reason
	}

	return sm, nil
}
