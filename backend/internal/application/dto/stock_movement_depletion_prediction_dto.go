package dto

import "time"

type StockDepletionPredictionDTO struct {
	AvgDailyOut   *float64   `json:"avgDailyOut,omitempty"`
	DaysLeft      *int       `json:"daysLeft,omitempty"`
	EstimatedDate *time.Time `json:"estimatedDate,omitempty"`
}
