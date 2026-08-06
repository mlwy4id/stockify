package product

import (
	"net/http"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/product"
	query "github.com/mlwy4id/stockify/internal/application/query/product"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/http/middleware"
)

type ProductHandler struct {
	createProductHandler       *command.CreateProductCommandHandler
	updateProductHandler       *command.UpdateProductCommandHandler
	archiveProductHandler      *command.ArchiveProductCommandHandler
	reactivateProductHandler   *command.ReactivateProductCommandHandler
	getAllProductsHandler      *query.GetAllProductsHandler
	getByCategoryHandler       *query.GetProductByCategoryHandler
	getLowStockHandler         *query.GetLowStockProductsHandler
	getProductDashboardHandler *query.GetProductDashboardByProductIDHandler
}

func NewProductHandler(
	createHandler *command.CreateProductCommandHandler,
	updateHandler *command.UpdateProductCommandHandler,
	archiveHandler *command.ArchiveProductCommandHandler,
	reactivateHandler *command.ReactivateProductCommandHandler,
	getAllProductsHandler *query.GetAllProductsHandler,
	getByCategoryHandler *query.GetProductByCategoryHandler,
	getLowStockHandler *query.GetLowStockProductsHandler,
	getProductDashboardHandler *query.GetProductDashboardByProductIDHandler,
) *ProductHandler {
	return &ProductHandler{
		createProductHandler:       createHandler,
		updateProductHandler:       updateHandler,
		archiveProductHandler:      archiveHandler,
		reactivateProductHandler:   reactivateHandler,
		getAllProductsHandler:      getAllProductsHandler,
		getByCategoryHandler:       getByCategoryHandler,
		getLowStockHandler:         getLowStockHandler,
		getProductDashboardHandler: getProductDashboardHandler,
	}
}

// Create godoc
// @Summary      Create a new product
// @Description  Create a new inventory product with name, quantity, and threshold
// @Tags         Product
// @Accept       json
// @Produce      json
// @Param        body body     CreateProductRequest true "Product data"
// @Success      201  {object} map[string]interface{} "product_id"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/ [post]
// @Security     CookieAuth
func (ph *ProductHandler) Create(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

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

	var categoryId *vo.CategoryId

	if req.CategoryID != nil {
		cid, err := vo.ParseCategoryId(*req.CategoryID)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		categoryId = &cid
	}

	cmd := command.CreateProductCommand{
		UserId:         userId,
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

// Update godoc
// @Summary      Update a product
// @Description  Update product name, stock threshold, or category
// @Tags         Product
// @Accept       json
// @Produce      json
// @Param        id   path     string                true "Product ID"
// @Param        body body     UpdateProductRequest   true "Product fields to update"
// @Success      200  {object} map[string]interface{} "product_id"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/{id} [patch]
// @Security     CookieAuth
func (ph *ProductHandler) Update(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

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
		UserId:         userId,
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

// Archive godoc
// @Summary      Archive a product
// @Description  Soft-archive a product to hide it from active listings
// @Tags         Product
// @Produce      json
// @Param        id   path     string true "Product ID"
// @Success      200  {object} map[string]interface{} "product_id"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/{id}/archive [patch]
// @Security     CookieAuth
func (ph *ProductHandler) Archive(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := vo.ParseProductId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id"})
		return
	}

	cmd := command.ArchiveProductCommand{UserId: userId, Id: id}
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

// Reactivate godoc
// @Summary      Reactivate a product
// @Description  Restore an archived product back to active status
// @Tags         Product
// @Produce      json
// @Param        id   path     string true "Product ID"
// @Success      200  {object} map[string]interface{} "product_id"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/{id}/reactivate [patch]
// @Security     CookieAuth
func (ph *ProductHandler) Reactivate(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	id, err := vo.ParseProductId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id"})
		return
	}

	cmd := command.ReactivateProductCommand{UserId: userId, Id: id}
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

// GetAll godoc
// @Summary      Get all products
// @Description  Retrieve all active products for the authenticated user
// @Tags         Product
// @Produce      json
// @Success      200  {object} map[string]interface{} "list of products"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/ [get]
// @Security     CookieAuth
func (ph *ProductHandler) GetAll(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	products, err := ph.getAllProductsHandler.Handle(ctx.Request.Context(), userId)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"products": products,
		"message":  "products retrieved successfully",
	})
}

// GetDashboardByProductId godoc
// @Summary      Get product dashboard analytics
// @Description  Get combined analytics (volume, sold/broken ratio, depletion prediction, restock interval) for a product
// @Tags         Product
// @Produce      json
// @Param        id   path     string true "Product ID"
// @Success      200  {object} map[string]interface{} "dashboard data"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Failure      404  {object} map[string]interface{} "product not found"
// @Router       /product/{id}/dashboard [get]
// @Security     CookieAuth
func (ph *ProductHandler) GetDashboardByProductId(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	productId, err := vo.ParseProductId(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid product id"})
		return
	}

	q := query.GetProductDashboardByProductIDQuery{UserId: userId, ProductId: productId}
	dashboard, err := ph.getProductDashboardHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    dashboard,
		"message": "dashboard retrieved successfully",
	})
}

// GetByCategory godoc
// @Summary      Get products by category
// @Description  Retrieve all products in a specific category
// @Tags         Product
// @Produce      json
// @Param        id   path     string true "Category ID"
// @Success      200  {object} map[string]interface{} "list of products"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/category/{id} [get]
// @Security     CookieAuth
func (ph *ProductHandler) GetByCategory(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	categoryId, err := vo.ParseCategoryId(ctx.Param("id"))

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid category id"})
		return
	}

	q := query.GetProductByCategoryQuery{UserId: userId, CategoryId: categoryId}
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

// GetLowStock godoc
// @Summary      Get low stock products
// @Description  Retrieve products where quantity is below stock threshold
// @Tags         Product
// @Produce      json
// @Success      200  {object} map[string]interface{} "list of low stock products"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/low-stock [get]
// @Security     CookieAuth
func (ph *ProductHandler) GetLowStock(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	products, err := ph.getLowStockHandler.Handle(ctx.Request.Context(), userId)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"products": products,
		"message":  "products retrieved successfully",
	})
}
