package dto

type GlobalStockMovementSummaryDTO struct {
	TotalIn          int                       `json:"totalIn"`
	TotalOut         int                       `json:"totalOut"`
	ProductSummaries []StockMovementSummaryDTO `json:"productSummaries"`
}
