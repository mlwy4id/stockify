package stockmovement

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/stock_movement"
	query "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/http/middleware"
)

type StockMovementHandler struct {
	createStockMovementHandler              *command.CreateStockMovementCommandHandler
	getStockMovementByProductIDHandler      *query.GetStockMovementByProductIDHandler
	getDashboardStockMovementSummaryHandler *query.GetDashboardStockMovementSummaryHandler
	getTopMoversHandler                     *query.GetTopMoversHandler
	getStockChartByProductIDHandler         *query.GetStockChartByProductIDHandler
	getStockChartHandler                    *query.GetStockChartHandler
}

func NewStockMovementHandler(
	createHandler *command.CreateStockMovementCommandHandler,
	getByProductIDHandler *query.GetStockMovementByProductIDHandler,
	getGlobalSummaryHandler *query.GetDashboardStockMovementSummaryHandler,
	getTopMoversHandler *query.GetTopMoversHandler,
	getStockChartByProductIDHandler *query.GetStockChartByProductIDHandler,
	getStockChartHandler *query.GetStockChartHandler,
) *StockMovementHandler {
	return &StockMovementHandler{
		createStockMovementHandler:              createHandler,
		getStockMovementByProductIDHandler:      getByProductIDHandler,
		getDashboardStockMovementSummaryHandler: getGlobalSummaryHandler,
		getTopMoversHandler:                     getTopMoversHandler,
		getStockChartByProductIDHandler:         getStockChartByProductIDHandler,
		getStockChartHandler:                    getStockChartHandler,
	}
}

// Create godoc
// @Summary      Create a stock movement
// @Description  Record a stock movement (RESTOCK, REFUND, SOLD, BROKEN) for a product
// @Tags         Stock Movement
// @Accept       json
// @Produce      json
// @Param        id   path     string                      true "Product ID"
// @Param        body body     CreateStockMovementRequest   true "Stock movement data"
// @Success      201  {object} map[string]interface{} "message"
// @Failure      400  {object} map[string]interface{} "validation error"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/{id}/stock-movements/ [post]
// @Security     CookieAuth
func (smh *StockMovementHandler) Create(ctx *gin.Context) {
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

	var req CreateStockMovementRequest

	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	action := enum.Action(req.Action)

	if !action.IsValid() {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "action must be one of: RESTOCK, REFUND, SOLD, BROKEN"})
		return
	}

	quantity, err := vo.NewQuantity(req.Quantity)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	date, err := time.Parse(time.RFC3339, req.Date)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use RFC3339"})
		return
	}

	cmd := command.CreateStockMovementCommand{
		UserId:    userId,
		ProductId: productId,
		Action:    action,
		Quantity:  quantity,
		Source:    req.Source,
		Reason:    req.Reason,
		Date:      date,
	}

	if err := smh.createStockMovementHandler.Handle(ctx.Request.Context(), cmd); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "stock movement created successfully",
	})
}

// GetByProductID godoc
// @Summary      Get stock movements by product
// @Description  Retrieve all stock movements for a specific product
// @Tags         Stock Movement
// @Produce      json
// @Param        id   path     string true "Product ID"
// @Success      200  {object} map[string]interface{} "list of movements"
// @Failure      400  {object} map[string]interface{} "invalid id"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /product/{id}/stock-movements/ [get]
// @Security     CookieAuth
func (smh *StockMovementHandler) GetByProductID(ctx *gin.Context) {
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

	q := query.GetStockMovementByProductIDQuery{
		UserId:    userId,
		ProductId: productId,
	}

	movements, err := smh.getStockMovementByProductIDHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"movements": movements,
		"message":   "movements retrieved successfully",
	})
}

// GetChartByProductID godoc
// @Summary      Get stock chart by product
// @Description  Get stock level over time for a product, optionally filtered by date range
// @Tags         Stock Movement
// @Produce      json
// @Param        id     path     string true "Product ID"
// @Param        range  query    string false "Date filter: 1w, 1m, 3m, 6m, 1y (empty means all time)"
// @Success      200  {object} map[string]interface{} "chart data"
// @Failure      400  {object} map[string]interface{} "invalid id or range"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Failure      404  {object} map[string]interface{} "product not found"
// @Router       /product/{id}/chart [get]
// @Security     CookieAuth
func (smh *StockMovementHandler) GetChartByProductID(ctx *gin.Context) {
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

	var dateFilter *enum.DateFilter

	if df := ctx.Query("range"); df != "" {
		filter := enum.DateFilter(df)

		if !filter.IsValid() {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid range, use: 1w, 1m, 3m, 6m, 1y"})
			return
		}

		dateFilter = &filter
	}

	q := query.GetStockChartByProductIDQuery{
		UserId:     userId,
		ProductId:  productId,
		DateFilter: dateFilter,
	}

	chart, err := smh.getStockChartByProductIDHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"chart":   chart,
		"message": "chart retrieved successfully",
	})
}

// GetChart godoc
// @Summary      Get global stock chart
// @Description  Get overall stock level over time across all products, optionally filtered by date range
// @Tags         Stock Movement
// @Produce      json
// @Param        range  query    string false "Date filter: 1w, 1m, 3m, 6m, 1y (empty means all time)"
// @Success      200  {object} map[string]interface{} "chart data"
// @Failure      400  {object} map[string]interface{} "invalid range"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /stock-movements/chart [get]
// @Security     CookieAuth
func (smh *StockMovementHandler) GetChart(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var dateFilter *enum.DateFilter

	if df := ctx.Query("range"); df != "" {
		filter := enum.DateFilter(df)

		if !filter.IsValid() {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid range, use: 1w, 1m, 3m, 6m, 1y"})
			return
		}

		dateFilter = &filter
	}

	q := query.GetStockChartQuery{
		UserId:     userId,
		DateFilter: dateFilter,
	}

	chart, err := smh.getStockChartHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"chart":   chart,
		"message": "chart retrieved successfully",
	})
}

// GetGlobalSummary godoc
// @Summary      Get global stock movement summary
// @Description  Get daily in/out summary across all products, compared to the previous day
// @Tags         Stock Movement
// @Produce      json
// @Success      200  {object} map[string]interface{} "global summary"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /stock-movements/ [get]
// @Security     CookieAuth
func (smh *StockMovementHandler) GetDashboardSummary(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	q := query.GetDashboardStockMovementSummaryQuery{
		UserId: userId,
	}

	summary, err := smh.getDashboardStockMovementSummaryHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"summary": summary,
		"message": "summary retrieved successfully",
	})
}

// GetTopMovers godoc
// @Summary      Get top movers
// @Description  Get products with highest stock out activity, optionally filtered by date
// @Tags         Stock Movement
// @Produce      json
// @Param        limit       query    int    false "Max results (default 10)"
// @Param        dateFilter  query    string false "Date filter: 1d, 1w, 1m, 3m, 6m, 1y"
// @Success      200  {object} map[string]interface{} "list of top movers"
// @Failure      400  {object} map[string]interface{} "invalid filter"
// @Failure      401  {object} map[string]interface{} "unauthorized"
// @Router       /stock-movements/top-movers [get]
// @Security     CookieAuth
func (smh *StockMovementHandler) GetTopMovers(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	limit := 10

	if lmt := ctx.Query("limit"); lmt != "" {
		if parsed, err := strconv.Atoi(lmt); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	var dateFilter *enum.DateFilter

	if df := ctx.Query("dateFilter"); df != "" {
		filter := enum.DateFilter(df)

		if !filter.IsValid() {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid date filter, use: 1d, 1w, 1m, 3m, 6m, 1y"})
			return
		}

		dateFilter = &filter
	}

	q := query.GetTopMoversQuery{
		UserId:     userId,
		Limit:      limit,
		DateFilter: dateFilter,
	}

	movers, err := smh.getTopMoversHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"movers": movers,
	})
}
