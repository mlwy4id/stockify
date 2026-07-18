package dto

type StockMovementSummaryDTO struct {
	ProductId   string `json:"productId"`
	ProductName string `json:"productName"`
	TotalIn     int    `json:"totalIn"`
	TotalOut    int    `json:"totalOut"`
}
