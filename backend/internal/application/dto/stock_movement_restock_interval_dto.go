package dto

type StockRestockIntervalDTO struct {
	RestockCount           int      `json:"restockCount"`
	AvgRestockIntervalDays *float64 `json:"avgRestockIntervalDays,omitempty"`
}
