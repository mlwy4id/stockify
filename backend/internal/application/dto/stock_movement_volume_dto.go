package dto

type StockMovementVolumeRangeDTO struct {
	Range    string `json:"range"`
	TotalIn  int    `json:"totalIn"`
	TotalOut int    `json:"totalOut"`
}

type StockMovementVolumeDTO struct {
	ProductId   *string                       `json:"productId,omitempty"`
	ProductName *string                       `json:"productName,omitempty"`
	Ranges      []StockMovementVolumeRangeDTO `json:"ranges"`
}
