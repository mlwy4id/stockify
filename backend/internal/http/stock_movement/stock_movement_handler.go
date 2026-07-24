package stockmovement

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/product"
	query "github.com/mlwy4id/stockify/internal/application/query/product"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/http/middleware"
)

type StockMovementHandler struct {
	createStockMovementHandler                *command.CreateStockMovementCommandHandler
	getStockMovementByProductIDHandler        *query.GetStockMovementByProductIDHandler
	getStockMovementSummaryByProductIDHandler *query.GetStockMovementSummaryByProductIDHandler
	getGlobalStockMovementSummaryHandler      *query.GetGlobalStockMovementSummaryHandler
	getTopMoversHandler                       *query.GetTopMoversHandler
}

func NewStockMovementHandler(
	createHandler *command.CreateStockMovementCommandHandler,
	getByProductIDHandler *query.GetStockMovementByProductIDHandler,
	getSummaryByProductIDHandler *query.GetStockMovementSummaryByProductIDHandler,
	getGlobalSummaryHandler *query.GetGlobalStockMovementSummaryHandler,
	getTopMoversHandler *query.GetTopMoversHandler,
) *StockMovementHandler {
	return &StockMovementHandler{
		createStockMovementHandler:                createHandler,
		getStockMovementByProductIDHandler:        getByProductIDHandler,
		getStockMovementSummaryByProductIDHandler: getSummaryByProductIDHandler,
		getGlobalStockMovementSummaryHandler:      getGlobalSummaryHandler,
		getTopMoversHandler:                       getTopMoversHandler,
	}
}

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

func (smh *StockMovementHandler) GetSummaryByProductID(ctx *gin.Context) {
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

	if df := ctx.Query("dateFilter"); df != "" {
		filter := enum.DateFilter(df)

		if !filter.IsValid() {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid date filter, use: 1d, 1w, 1m, 3m, 6m, 1y"})
			return
		}

		dateFilter = &filter
	}

	q := query.GetStockMovementSummaryByProductIDQuery{
		UserId:     userId,
		ProductId:  productId,
		DateFilter: dateFilter,
	}

	summary, err := smh.getStockMovementSummaryByProductIDHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"summary": summary,
		"message": "summary retrieved successfully",
	})
}

func (smh *StockMovementHandler) GetGlobalSummary(ctx *gin.Context) {
	userId, err := vo.ParseUserId(middleware.GetUserIdFromContext(ctx))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
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

	q := query.GetGlobalStockMovementSummaryQuery{
		UserId:     userId,
		DateFilter: dateFilter,
	}

	summary, err := smh.getGlobalStockMovementSummaryHandler.Handle(ctx.Request.Context(), q)

	if err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"summary": summary,
		"message": "summary retrieved successfully",
	})
}

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
