package stockmovement_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/stock_movement"
	stock_movement "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	handler "github.com/mlwy4id/stockify/internal/http/stock_movement"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func newStockMovementHandlerHarness(t *testing.T) (*fakes.MockProductRepository, *gin.Engine) {
	t.Helper()
	gin.SetMode(gin.TestMode)

	repo := new(fakes.MockProductRepository)

	stockMovementHandler := handler.NewStockMovementHandler(
		command.NewCreateStockMovementCommandHandler(repo),
		stock_movement.NewGetStockMovementByProductIDHandler(repo),
		stock_movement.NewGetAllStockMovementsHandler(repo),
		stock_movement.NewGetDashboardStockMovementSummaryHandler(repo),
		stock_movement.NewGetTopMoversHandler(repo),
		stock_movement.NewGetStockChartByProductIDHandler(repo),
		stock_movement.NewGetStockChartHandler(repo),
	)

	engine := gin.New()
	protected := engine.Group("/api")
	// A stand-in for middleware.Auth(): injects a valid user id into the context.
	protected.Use(func(c *gin.Context) { c.Set("userId", "11111111-1111-1111-1111-111111111111"); c.Next() })
	protected.POST("/product/:id/stock-movements", stockMovementHandler.Create)
	protected.GET("/product/:id/stock-movements", stockMovementHandler.GetByProductID)
	protected.GET("/stock-movements/all", stockMovementHandler.GetAll)
	protected.GET("/stock-movements/top-movers", stockMovementHandler.GetTopMovers)
	protected.GET("/stock-movements", stockMovementHandler.GetDashboardSummary)
	protected.GET("/stock-movements/chart", stockMovementHandler.GetChart)
	protected.GET("/product/:id/chart", stockMovementHandler.GetChartByProductID)

	return repo, engine
}

func doMovementJSON(t *testing.T, engine *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
	t.Helper()
	// Routes are registered under the "/api" group; keep call sites relative.
	req := httptest.NewRequest(method, "/api"+path, strings.NewReader(body))
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, req)
	return recorder
}

const productID = "22222222-2222-2222-2222-222222222222"

func Test_StockMovementHandler_Create_AllCases_CorrectResults(t *testing.T) {
	validBody := `{"action":"RESTOCK","quantity":10,"source":"supplier","reason":" refill","date":"2026-09-01T10:00:00Z"}`

	t.Run("rejects an invalid action with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements",
			`{"action":"DONATED","quantity":1,"date":"2026-09-01T10:00:00Z"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "RESTOCK, REFUND, SOLD, BROKEN")
		repo.AssertNotCalled(t, "FindByID")
	})

	t.Run("rejects a non-positive quantity with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		for _, quantity := range []string{"0", "-3"} {
			recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements",
				`{"action":"RESTOCK","quantity":`+quantity+`,"date":"2026-09-01T10:00:00Z"}`)

			assert.Equal(t, http.StatusBadRequest, recorder.Code, "quantity %s", quantity)
		}
		repo.AssertNotCalled(t, "FindByID")
	})

	t.Run("rejects a non-RFC3339 date with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements",
			`{"action":"RESTOCK","quantity":1,"date":"01/09/2026"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "RFC3339")
		repo.AssertNotCalled(t, "FindByID")
	})

	t.Run("rejects a missing payload field with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements",
			`{"action":"RESTOCK","date":"2026-09-01T10:00:00Z"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		repo.AssertNotCalled(t, "FindByID")
	})

	t.Run("creates a restock and returns 201", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		product := productForMovement(t, 10, 2)
		repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(product, nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements", validBody)

		require.Equal(t, http.StatusCreated, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "stock movement created successfully")
		repo.AssertExpectations(t)
	})

	t.Run("returns 422 when the product is missing", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(nil, errors.New("not found"))

		recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements", validBody)

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})

	t.Run("returns 422 when saving the movement fails", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(productForMovement(t, 10, 2), nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(errors.New("db down"))

		recorder := doMovementJSON(t, engine, http.MethodPost, "/product/"+productID+"/stock-movements", validBody)

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

func Test_StockMovementHandler_GetByProductID_AllCases_CorrectResults(t *testing.T) {
	t.Run("returns the movements of the product", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		movements := []*entity.StockMovement{movementOf(t)}
		repo.On("GetStockMovementsByProductID", mock.Anything, mock.Anything, mock.Anything, false).Return(movements, nil)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/product/"+productID+"/stock-movements", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		payload := bodyMap(t, recorder)
		require.Contains(t, payload, "movements")
		assert.Len(t, payload["movements"].([]any), 1)
		repo.AssertExpectations(t)
	})

	t.Run("propagates a repository failure as 422", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("GetStockMovementsByProductID", mock.Anything, mock.Anything, mock.Anything, false).Return(nil, errors.New("db down"))

		recorder := doMovementJSON(t, engine, http.MethodGet, "/product/"+productID+"/stock-movements", "")

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

func Test_StockMovementHandler_GetAll_AllCases_CorrectResults(t *testing.T) {
	t.Run("rejects a bad startDate with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/all?startDate=09-01-2026", "")

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "startDate")
		repo.AssertNotCalled(t, "GetAllStockMovements")
	})

	t.Run("rejects a bad endDate with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/all?endDate=yesterday", "")

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "endDate")
		repo.AssertNotCalled(t, "GetAllStockMovements")
	})

	t.Run("passes RFC3339 range filters through", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("GetAllStockMovementsAndDateRangeWithProduct", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return([]*entity.StockMovementWithProduct{}, nil)

		recorder := doMovementJSON(t, engine, http.MethodGet,
			"/stock-movements/all?startDate=2026-09-01T00:00:00Z&endDate=2026-09-15T23:59:59Z", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "movements")
		repo.AssertExpectations(t)
	})

	t.Run("queries everything when no filter is present", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("GetAllStockMovementsWithProduct", mock.Anything, mock.Anything).Return([]*entity.StockMovementWithProduct{}, nil)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/all", "")

		assert.Equal(t, http.StatusOK, recorder.Code)
		repo.AssertExpectations(t)
	})
}

func Test_StockMovementHandler_GetTopMovers_AllCases_CorrectResults(t *testing.T) {
	t.Run("defaults the limit to 10", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("FindAllActive", mock.Anything, mock.Anything).Return([]*entity.Product{}, nil)
		repo.On("GetAllStockMovements", mock.Anything, mock.Anything).Return([]*entity.StockMovement{}, nil)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/top-movers", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "movers")
		repo.AssertExpectations(t)
	})

	t.Run("rejects an invalid date filter with 400", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/top-movers?dateFilter=2w", "")

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "1d, 1w, 1m, 3m, 6m, 1y")
		repo.AssertNotCalled(t, "FindAllActive")
	})
}

func Test_StockMovementHandler_Charts_AllCases_CorrectResults(t *testing.T) {
	t.Run("rejects an invalid range with 400 on the product chart", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/product/"+productID+"/chart?range=fortnight", "")

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		repo.AssertNotCalled(t, "GetStockMovementsByProductIDAndDateRange")
	})

	t.Run("rejects an invalid range with 400 on the global chart", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/chart?range=5y", "")

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		repo.AssertNotCalled(t, "GetAllStockMovements")
	})

	t.Run("returns 404 when the product chart handler fails", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(nil, errors.New("no product"))

		recorder := doMovementJSON(t, engine, http.MethodGet, "/product/"+productID+"/chart?range=1w", "")

		assert.Equal(t, http.StatusNotFound, recorder.Code)
	})

	t.Run("returns the global chart", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("GetAllStockMovements", mock.Anything, mock.Anything).Return([]*entity.StockMovement{}, nil)
		repo.On("GetTotalQuantity", mock.Anything, mock.Anything).Return(42, nil)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements/chart", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "chart")
		repo.AssertExpectations(t)
	})
}

func Test_StockMovementHandler_GetDashboardSummary_AllCases_CorrectResults(t *testing.T) {
	t.Run("returns the summary", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("FindAllActive", mock.Anything, mock.Anything).Return([]*entity.Product{}, nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return([]*entity.StockMovement{}, nil)
		repo.On("GetAllStockMovements", mock.Anything, mock.Anything).Return([]*entity.StockMovement{}, nil)

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "summary")
		repo.AssertExpectations(t)
	})

	t.Run("propagates a repository failure as 422", func(t *testing.T) {
		repo, engine := newStockMovementHandlerHarness(t)
		repo.On("FindAllActive", mock.Anything, mock.Anything).Return(nil, errors.New("db down"))

		recorder := doMovementJSON(t, engine, http.MethodGet, "/stock-movements", "")

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

// --- local fixture helpers ---

// productForMovement builds an active product the movement can attach to.
func productForMovement(t *testing.T, quantity int, threshold int) *entity.Product {
	t.Helper()
	p, err := entity.NewProduct(vo.NewUserId(), "Kopi", "", fakes.MustQuantity(t, quantity), fakes.MustThreshold(t, threshold), nil)
	require.NoError(t, err)
	return &p
}

// movementOf builds one RESTOCK movement at a deterministic timestamp.
func movementOf(t *testing.T) *entity.StockMovement {
	t.Helper()
	p := productForMovement(t, 10, 2)
	require.NoError(t, p.AddStockMovement(enum.Restock, fakes.MustQuantity(t, 4), "supplier", "refill", fakes.FixedTime()))
	require.Len(t, p.StockMovements(), 1)
	m := p.StockMovements()[0]
	return &m
}

func bodyMap(t *testing.T, recorder *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var payload map[string]any
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &payload))
	return payload
}
