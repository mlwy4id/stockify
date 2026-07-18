package dto

import "time"

type StockMovementDTO struct {
	ID       string `json:"id"`
	Action   string `json:"action"`
	Quantity int    `json:"quantity"`
	Source   string `json:"source,omitempty"`
	Reason   string `json:"reason,omitempty"`
	Date     time.Time `json:"date"`
}
