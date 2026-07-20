package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	app "github.com/mlwy4id/stockify/internal/application/command/category"
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

	ctx.JSON(http.StatusCreated, gin.H{"category_id": id})
}
