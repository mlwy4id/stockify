package http

type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required"`
}
