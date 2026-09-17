package product_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	command "github.com/mlwy4id/stockify/internal/application/command/product"
	query "github.com/mlwy4id/stockify/internal/application/query/product"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	handler "github.com/mlwy4id/stockify/internal/http/product"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type productHarness struct {
	engine *gin.Engine
	repo   *mocks.MockProductRepository
}

func newProductHandlerHarness(t *testing.T) productHarness {
	t.Helper()
	gin.SetMode(gin.TestMode)

	repo := new(mocks.MockProductRepository)

	productHandler := handler.NewProductHandler(
		command.NewCreateProductCommandHandler(repo),
		command.NewUpdateProductCommandHandler(repo),
		command.NewArchiveProductCommandHandler(repo),
		command.NewReactivateProductCommandHandler(repo),
		query.NewGetAllProductsHandler(repo),
		query.NewGetProductByCategoryHandler(repo),
		query.NewGetLowStockProductsHandler(repo),
		query.NewGetProductDashboardByProductIDHandler(repo),
		new(mocks.MockFileStorage),
	)

	engine := gin.New()
	protected := engine.Group("/api")
	// A stand-in for middleware.Auth(): injects a valid user id into the context.
	protected.Use(func(c *gin.Context) { c.Set("userId", "11111111-1111-1111-1111-111111111111"); c.Next() })
	protected.POST("/product", productHandler.Create)
	protected.PATCH("/product/:id", productHandler.Update)
	protected.PATCH("/product/:id/archive", productHandler.Archive)
	protected.PATCH("/product/:id/reactivate", productHandler.Reactivate)
	protected.GET("/product", productHandler.GetAll)
	protected.GET("/product/low-stock", productHandler.GetLowStock)
	protected.GET("/product/category/:id", productHandler.GetByCategory)
	protected.GET("/product/:id/dashboard", productHandler.GetDashboardByProductId)

	return productHarness{engine: engine, repo: repo}
}

func doProductJSON(t *testing.T, engine *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
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

func bodyMap(t *testing.T, recorder *httptest.ResponseRecorder) map[string]any {
	t.Helper()
	var payload map[string]any
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &payload))
	return payload
}

func Test_ProductHandler_Create_AllCases_CorrectResults(t *testing.T) {
	t.Run("rejects a missing name with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"quantity":5,"stockThreshold":2}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("rejects a malformed JSON body with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name": "Kopi", not valid json`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("rejects a negative quantity with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name":"Kopi","quantity":-1,"stockThreshold":2}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "item stock must not be negative")
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("rejects a negative stock threshold with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name":"Kopi","quantity":5,"stockThreshold":-2}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("passes any category id through to the domain (ParseCategoryId is permissive)", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name":"Kopi","quantity":5,"stockThreshold":2,"categoryId":"not-even-a-uuid"}`)

		assert.Equal(t, http.StatusCreated, recorder.Code)
		h.repo.AssertExpectations(t)
	})

	t.Run("rejects a broken image url with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name":"Kopi","quantity":5,"stockThreshold":2,"imageUrl":"ht!tp://bad url"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("creates the product and returns 201 with its id", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name":"Kopi","quantity":5,"stockThreshold":2,"imageUrl":"https://img"}`)

		require.Equal(t, http.StatusCreated, recorder.Code)
		assert.NotEmpty(t, bodyMap(t, recorder)["product_id"])
		h.repo.AssertExpectations(t)
	})

	t.Run("maps a domain rejection to 422", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(errors.New("save failed"))

		recorder := doProductJSON(t, h.engine, http.MethodPost, "/product", `{"name":"Kopi","quantity":5,"stockThreshold":2}`)

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
		h.repo.AssertExpectations(t)
	})
}

func Test_ProductHandler_Update_AllCases_CorrectResults(t *testing.T) {
	productID := "22222222-2222-2222-2222-222222222222"

	t.Run("rejects a negative threshold with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID, `{"stockThreshold":-1}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("passes any category id through to the domain (ParseCategoryId is permissive)", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(productPtr(t, "Kopi", 5, 2), nil)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID, `{"categoryId":"not-even-a-uuid"}`)

		assert.Equal(t, http.StatusOK, recorder.Code)
		h.repo.AssertExpectations(t)
	})

	t.Run("rejects a broken image url with 400", func(t *testing.T) {
		h := newProductHandlerHarness(t)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID, `{"imageUrl":"javascript:alert(1)"}`)

		assert.Equal(t, http.StatusBadRequest, recorder.Code)
		h.repo.AssertNotCalled(t, "Save")
	})

	t.Run("updates the product and returns 200", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(productPtr(t, "Kopi", 5, 2), nil)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID, `{"name":"Kopi Susu","stockThreshold":3}`)

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Contains(t, recorder.Body.String(), "product_id")
		h.repo.AssertExpectations(t)
	})
}

func Test_ProductHandler_ArchiveAndReactivate_AllCases_CorrectResults(t *testing.T) {
	productID := "22222222-2222-2222-2222-222222222222"

	t.Run("archives an existing product", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(productPtr(t, "Kopi", 5, 2), nil)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID+"/archive", "")

		assert.Equal(t, http.StatusOK, recorder.Code)
		h.repo.AssertExpectations(t)
	})

	t.Run("reactivates an archived product", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		archived := productPtr(t, "Kopi", 5, 2)
		_ = archived.ArchiveProduct()
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(archived, nil)
		h.repo.On("Save", mock.Anything, mock.Anything).Return(nil)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID+"/reactivate", "")

		assert.Equal(t, http.StatusOK, recorder.Code)
		h.repo.AssertExpectations(t)
	})

	t.Run("returns 422 when archiving twice", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		archived := productPtr(t, "Kopi", 5, 2)
		_ = archived.ArchiveProduct()
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(archived, nil)

		recorder := doProductJSON(t, h.engine, http.MethodPatch, "/product/"+productID+"/archive", "")

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

func Test_ProductHandler_GetAll_AllCases_CorrectResults(t *testing.T) {
	t.Run("returns the mapped products", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindAllActive", mock.Anything, mock.Anything).Return(
			[]*entity.Product{productPtr(t, "Kopi", 5, 2)}, nil)

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Equal(t, float64(5), bodyMap(t, recorder)["products"].([]any)[0].(map[string]any)["quantity"])
		h.repo.AssertExpectations(t)
	})

	t.Run("propagates a repository failure as 422", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindAllActive", mock.Anything, mock.Anything).Return(nil, errors.New("db down"))

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product", "")

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

func Test_ProductHandler_GetLowStock_AllCases_CorrectResults(t *testing.T) {
	t.Run("returns only the products below their threshold", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		below := productPtr(t, "Kopi", 2, 5)
		atThreshold := productPtr(t, "Teh", 5, 5)
		h.repo.On("FindAllActive", mock.Anything, mock.Anything).Return(
			[]*entity.Product{below, atThreshold}, nil)

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product/low-stock", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		products := bodyMap(t, recorder)["products"].([]any)
		require.Len(t, products, 1)
		assert.Equal(t, "Kopi", products[0].(map[string]any)["name"])
		h.repo.AssertExpectations(t)
	})

	t.Run("propagates a repository failure as 422", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindAllActive", mock.Anything, mock.Anything).Return(nil, errors.New("db down"))

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product/low-stock", "")

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

func Test_ProductHandler_GetByCategory_AllCases_CorrectResults(t *testing.T) {
	categoryID := "33333333-3333-3333-3333-333333333333"

	t.Run("returns the products of the category", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByCategoryID", mock.Anything, mock.Anything, mock.Anything).Return(
			[]*entity.Product{productPtr(t, "Kopi", 5, 2)}, nil)

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product/category/"+categoryID, "")

		require.Equal(t, http.StatusOK, recorder.Code)
		assert.Len(t, bodyMap(t, recorder)["products"].([]any), 1)
		h.repo.AssertExpectations(t)
	})

	t.Run("propagates a repository failure as 422", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByCategoryID", mock.Anything, mock.Anything, mock.Anything).Return(nil, errors.New("db down"))

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product/category/"+categoryID, "")

		assert.Equal(t, http.StatusUnprocessableEntity, recorder.Code)
	})
}

func Test_ProductHandler_GetDashboardByProductId_AllCases_CorrectResults(t *testing.T) {
	productID := "22222222-2222-2222-2222-222222222222"

	t.Run("returns 404 when the product does not exist", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(nil, errors.New("not found"))

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product/"+productID+"/dashboard", "")

		assert.Equal(t, http.StatusNotFound, recorder.Code)
		h.repo.AssertExpectations(t)
	})

	t.Run("returns the dashboard payload", func(t *testing.T) {
		h := newProductHandlerHarness(t)
		h.repo.On("FindByID", mock.Anything, mock.Anything, mock.Anything).Return(productPtr(t, "Kopi", 10, 3), nil)
		h.repo.On("GetStockMovementsByProductID", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return([]*entity.StockMovement{}, nil)

		recorder := doProductJSON(t, h.engine, http.MethodGet, "/product/"+productID+"/dashboard", "")

		require.Equal(t, http.StatusOK, recorder.Code)
		data := bodyMap(t, recorder)["data"].(map[string]any)
		assert.Equal(t, float64(10), data["currentStock"])
		h.repo.AssertExpectations(t)
	})
}

// productPtr builds a minimal active product owned by a fresh user.
func productPtr(t *testing.T, name string, quantity int, threshold int) *entity.Product {
	t.Helper()
	p, err := entity.NewProduct(vo.NewUserId(), name, "", mocks.MustQuantity(t, quantity), mocks.MustThreshold(t, threshold), nil)
	require.NoError(t, err)
	return &p
}
