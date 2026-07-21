package stockmovement

type CreateStockMovementRequest struct {
	Action   string `json:"action" binding:"required"`
	Quantity int    `json:"quantity" binding:"required"`
	Source   string `json:"source"`
	Reason   string `json:"reason"`
	Date     string `json:"date" binding:"required"`
}
