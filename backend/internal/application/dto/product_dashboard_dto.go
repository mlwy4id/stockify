package dto

type ProductDashboardDTO struct {
	ProductId       *string                                `json:"productId,omitempty"`
	ProductName     *string                                `json:"productName,omitempty"`
	CurrentStock    int                                    `json:"currentStock"`
	StockThreshold  *int                                   `json:"stockThreshold,omitempty"`
	CategoryId      *string                                `json:"categoryId,omitempty"`
	Volume          []StockMovementVolumeRangeDTO          `json:"volume"`
	Ratio           []StockMovementSoldBrokenRatioRangeDTO `json:"ratio"`
	Depletion       StockDepletionPredictionDTO            `json:"depletion"`
	RestockInterval StockRestockIntervalDTO                `json:"restockInterval"`
}
