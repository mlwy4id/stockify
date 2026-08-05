package dto

import "time"

type StockChartPointDTO struct {
	Date     time.Time `json:"date"`
	Quantity int       `json:"quantity"`
}

type StockChartDTO struct {
	Points []StockChartPointDTO `json:"points"`
}
