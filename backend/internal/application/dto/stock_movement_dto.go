package dto

import "time"

type StockMovementDTO struct {
	ID          string    `json:"id"`
	ProductId   string    `json:"productId,omitempty"`
	ProductName string    `json:"productName,omitempty"`
	Action      string    `json:"action"`
	Quantity    int       `json:"quantity"`
	Source      string    `json:"source,omitempty"`
	Reason      string    `json:"reason,omitempty"`
	Date        time.Time `json:"date"`
}
