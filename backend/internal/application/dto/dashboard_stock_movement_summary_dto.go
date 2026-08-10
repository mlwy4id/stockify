package dto

type DashboardStockMovementSummaryDTO struct {
	TotalIn             int                                    `json:"totalIn"`
	TotalOut            int                                    `json:"totalOut"`
	InChangePercentage  float64                                `json:"inChangePercentage"`
	OutChangePercentage float64                                `json:"outChangePercentage"`
	TotalActiveProduct  int                                    `json:"totalActiveProduct"`
	TotalQuantity       int                                    `json:"totalQuantity"`
	Volume              []StockMovementVolumeRangeDTO          `json:"volume"`
	Ratio               []StockMovementSoldBrokenRatioRangeDTO `json:"ratio"`
}
