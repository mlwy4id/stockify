package dto

type StockMovementVolumeRangeDTO struct {
	Range    string `json:"range"`
	TotalIn  int    `json:"totalIn"`
	TotalOut int    `json:"totalOut"`
}
