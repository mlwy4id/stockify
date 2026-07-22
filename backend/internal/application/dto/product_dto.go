package dto

type ProductSummaryDTO struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Quantity   int    `json:"quantity"`
	CategoryId *string `json:"categoryId"`
}
