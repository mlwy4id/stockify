package product

type CreateProductRequest struct {
	Name           string  `json:"name" binding:"required"`
	Quantity       int     `json:"quantity" binding:"required"`
	StockThreshold int     `json:"stockThreshold" binding:"required"`
	CategoryID     *string `json:"categoryId"`
}

type UpdateProductRequest struct {
	Name           *string `json:"name,omitempty"`
	StockThreshold *int    `json:"stockThreshold,omitempty"`
	CategoryID     *string `json:"categoryId,omitempty"`
}
