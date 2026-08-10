package category

import (
	"net/http"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/category"
	query "github.com/mlwy4id/stockify/internal/application/query/category"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/http/middleware"
)

type CategoryHandler struct {
	createCategoryHandler *command.CreateCategoryCommandHandler
	deleteCategoryHandler *command.DeleteCategoryCommandHandler
	renameCategoryHandler *command.RenameCategoryCommandHandler
	getAllCategoryHandler *query.GetAllCategoryQueryHandler
	getCategoryById       *query.GetCategoryByIDQueryHandler
}

func NewCategoryHandler(
	createHandler *command.CreateCategoryCommandHandler,
	deleteHandler *command.DeleteCategoryCommandHandler,
	renameHandler *command.RenameCategoryCommandHandler,
	getAllCategoryHandler *query.GetAllCategoryQueryHandler,
	getCategoryById *query.GetCategoryByIDQueryHandler,
) *CategoryHandler {
	return &CategoryHandler{
		createCategoryHandler: createHandler,
		deleteCategoryHandler: deleteHandler,
		renameCategoryHandler: renameHandler,
		getAllCategoryHandler: getAllCategoryHandler,
		getCategoryById:       getCategoryById,
	}
}

// Create godoc
// @Summary      Create a new category
// @Description  Create a new inventory category for the authenticated user
// @Tags         Category
// @Accept       json
// @Produce      json
// @Param        body body     CreateCategoryRequest true "Category name"
// @Success      201  {object} map[string]interface{} "category_id"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /category/ [post]
// @Security     CookieAuth
func (ch *CategoryHandler) Create(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req CreateCategoryRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.CreateCategoryCommand{UserId: userId, Name: req.Name}
	id, err := ch.createCategoryHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":     "new category created successfully",
		"category_id": id,
	})
}

// Delete godoc
// @Summary      Delete a category
// @Description  Soft-delete a category and unassign its products
// @Tags         Category
// @Produce      json
// @Param        id   path     string true "Category ID"
// @Success      200  {object} map[string]interface{} "category_id"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /category/{id} [delete]
// @Security     CookieAuth
func (ch *CategoryHandler) Delete(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := vo.ParseCategoryId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.DeleteCategoryCommand{UserId: userId, Id: id}
	err = ch.deleteCategoryHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":     "category deleted successfully",
		"category_id": id.Value(),
	})
}

// Rename godoc
// @Summary      Rename a category
// @Description  Update the name of an existing category
// @Tags         Category
// @Accept       json
// @Produce      json
// @Param        id   path     string                true "Category ID"
// @Param        body body     RenameCategoryRequest true "New name"
// @Success      200  {object} map[string]interface{} "category_id"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /category/{id} [patch]
// @Security     CookieAuth
func (ch *CategoryHandler) Rename(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := vo.ParseCategoryId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req RenameCategoryRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.RenameCategoryCommand{
		UserId: userId,
		Id:     id,
		Name:   req.Name,
	}

	categoryId, err := ch.renameCategoryHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":     "category renamed successfully",
		"category_id": categoryId,
	})
}

// GetAll godoc
// @Summary      Get all categories
// @Description  Retrieve all categories for the authenticated user
// @Tags         Category
// @Produce      json
// @Success      200 {object} map[string]interface{} "list of categories"
// @Failure      401 {object} map[string]interface{} "unauthorized"
// @Router       /category/ [get]
// @Security     CookieAuth
func (ch *CategoryHandler) GetAll(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	categories, err := ch.getAllCategoryHandler.Handle(ctx.Request.Context(), userId)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": categories,
	})
}

// GetById godoc
// @Summary      Get a category by ID
// @Description  Retrieve a single category by its ID
// @Tags         Category
// @Produce      json
// @Param        id   path     string true "Category ID"
// @Success      200  {object} map[string]interface{} "category data"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /category/{id} [get]
// @Security     CookieAuth
func (ch *CategoryHandler) GetById(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := vo.ParseCategoryId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	q := query.GetCategoryByIDQuery{UserId: userId, CategoryID: id}
	category, err := ch.getCategoryById.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": category,
	})
}
