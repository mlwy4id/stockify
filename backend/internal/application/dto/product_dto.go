package dto

type ProductSummaryDTO struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	ImageUrl   *string `json:"imageUrl,omitempty"`
	Quantity   int     `json:"quantity"`
	CategoryId *string `json:"categoryId"`
}
