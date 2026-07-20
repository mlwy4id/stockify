package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	app "github.com/mlwy4id/stockify/internal/application/command/category"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type CategoryHandler struct {
	createCategoryHandler *app.CreateCategoryCommandHandler
	deleteCategoryHandler *app.DeleteCategoryCommandHandler
	renameCategoryCommand *app.RenameCategoryCommandHandler
}

func NewCategoryHandler(
	createHandler *app.CreateCategoryCommandHandler,
	deleteHandler *app.DeleteCategoryCommandHandler,
	renameHandler *app.RenameCategoryCommandHandler,
) *CategoryHandler {
	return &CategoryHandler{
		createCategoryHandler: createHandler,
		deleteCategoryHandler: deleteHandler,
		renameCategoryCommand: renameHandler,
	}
}

func (ch *CategoryHandler) Create(ctx *gin.Context) {
	var req CreateCategoryRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := app.CreateCategoryCommand{Name: req.Name}
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

func (ch *CategoryHandler) Delete(ctx *gin.Context) {
	id, err := vo.ParseCategoryId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := app.DeleteCategoryCommand{Id: id}
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

func (ch *CategoryHandler) Rename(ctx *gin.Context) {
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

	cmd := app.RenameCategoryCommand{
		Id:   id,
		Name: req.Name,
	}
	categoryId, err := ch.renameCategoryCommand.Handle(ctx, cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":     "category renamed successfully",
		"category_id": categoryId,
	})
}
