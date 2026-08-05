package dto

import "time"

type StockChartPointDTO struct {
	Date     time.Time `json:"date"`
	Quantity int       `json:"quantity"`
}

type StockChartDTO struct {
	ProductId   *string              `json:"productId,omitempty"`
	ProductName *string              `json:"productName,omitempty"`
	Points      []StockChartPointDTO `json:"points"`
}
