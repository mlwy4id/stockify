package product

import (
	"net/http"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/product"
	query "github.com/mlwy4id/stockify/internal/application/query/product"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type ProductHandler struct {
	createProductHandler     *command.CreateProductCommandHandler
	updateProductHandler     *command.UpdateProductCommandHandler
	archiveProductHandler    *command.ArchiveProductCommandHandler
	reactivateProductHandler *command.ReactivateProductCommandHandler
	getByCategoryHandler     *query.GetProductByCategoryHandler
	getLowStockHandler       *query.GetLowStockProductsHandler
}

func NewProductHandler(
	createHandler *command.CreateProductCommandHandler,
	updateHandler *command.UpdateProductCommandHandler,
	archiveHandler *command.ArchiveProductCommandHandler,
	reactivateHandler *command.ReactivateProductCommandHandler,
	getByCategoryHandler *query.GetProductByCategoryHandler,
	getLowStockHandler *query.GetLowStockProductsHandler,
) *ProductHandler {
	return &ProductHandler{
		createProductHandler:     createHandler,
		updateProductHandler:     updateHandler,
		archiveProductHandler:    archiveHandler,
		reactivateProductHandler: reactivateHandler,
		getByCategoryHandler:     getByCategoryHandler,
		getLowStockHandler:       getLowStockHandler,
	}
}

func (ph *ProductHandler) Create(ctx *gin.Context) {
	var req CreateProductRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	quantity, err := vo.NewQuantity(req.Quantity)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	stockThreshold, err := vo.NewStockThreshold(req.StockThreshold)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	categoryId, err := vo.ParseCategoryId(req.CategoryID)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.CreateProductCommand{
		Name:           req.Name,
		Quantity:       quantity,
		StockThreshold: stockThreshold,
		CategoryId:     categoryId,
	}
	productId, err := ph.createProductHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":    "product created successfully",
		"product_id": productId,
	})
}

func (ph *ProductHandler) Update(ctx *gin.Context) {
	id, err := vo.ParseProductId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id"})
		return
	}

	var req UpdateProductRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cmdName *string

	if req.Name != nil {
		cmdName = req.Name
	}

	var cmdThreshold *vo.StockThreshold

	if req.StockThreshold != nil {
		threshold, err := vo.NewStockThreshold(*req.StockThreshold)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		cmdThreshold = &threshold
	}

	var cmdCategoryId *vo.CategoryId

	if req.CategoryID != nil {
		categoryId, err := vo.ParseCategoryId(*req.CategoryID)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		cmdCategoryId = &categoryId
	}

	cmd := command.UpdateProductCommand{
		Id:             id,
		Name:           cmdName,
		StockThreshold: cmdThreshold,
		CategoryId:     cmdCategoryId,
	}

	productId, err := ph.updateProductHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":    "product updated successfully",
		"product_id": productId,
	})
}

func (ph *ProductHandler) Archive(ctx *gin.Context) {
	id, err := vo.ParseProductId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.ArchiveProductCommand{Id: id}
	err = ph.archiveProductHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":    "product archived successfully",
		"product_id": id.Value(),
	})
}

func (ph *ProductHandler) Reactivate(ctx *gin.Context) {
	id, err := vo.ParseProductId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cmd := command.ReactivateProductCommand{Id: id}
	err = ph.reactivateProductHandler.Handle(ctx.Request.Context(), cmd)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":    "product reactivated successfully",
		"product_id": id.Value(),
	})
}

func (ph *ProductHandler) GetByCategory(ctx *gin.Context) {
	categoryId, err := vo.ParseCategoryId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid category id"})
		return
	}

	q := query.GetProductByCategoryQuery{CategoryId: categoryId}
	products, err := ph.getByCategoryHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"products": products,
		"message":  "products retrieved successfully",
	})
}

func (ph *ProductHandler) GetLowStock(ctx *gin.Context) {
	products, err := ph.getLowStockHandler.Handle(ctx.Request.Context(), query.GetLowStockProductsQuery{})

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"products": products,
		"message":  "products retrieved successfully",
	})
}
