package dto

type StockMovementSoldBrokenRatioRangeDTO struct {
	Range            string  `json:"range"`
	TotalSold        int     `json:"totalSold"`
	TotalBroken      int     `json:"totalBroken"`
	SoldPercentage   float64 `json:"soldPercentage"`
	BrokenPercentage float64 `json:"brokenPercentage"`
}
