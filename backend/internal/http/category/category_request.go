package category

type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required"`
}

type RenameCategoryRequest struct {
	Name string `json:"name" binding:"required"`
}
