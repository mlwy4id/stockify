package product_test

import (
	"context"
	"errors"
	"testing"
	"time"

	query "github.com/mlwy4id/stockify/internal/application/query/product"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func movementsPtr(ms ...entity.StockMovement) []*entity.StockMovement {
	out := make([]*entity.StockMovement, len(ms))
	for i := range ms {
		m := ms[i]
		out[i] = &m
	}
	return out
}

func Test_GetProductDashboardQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	t.Run("propagates the lookup error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(nil, boom)

		_, err := query.NewGetProductDashboardByProductIDHandler(repo).Handle(
			context.Background(),
			query.GetProductDashboardByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the movements error", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, true).Return(nil, boom)

		_, err := query.NewGetProductDashboardByProductIDHandler(repo).Handle(
			context.Background(),
			query.GetProductDashboardByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("combines stock, volume, ratio, depletion and restock interval", func(t *testing.T) {
		categoryID := vo.NewCategoryId()
		product := mocks.MustProductFull(t, userID, "Kopi Susu", "https://img", 10, 3, &categoryID)

		now := time.Now()
		movements := movementsPtr(
			mocks.MustStockMovement(t, userID, productID, enum.Restock, 20, 10, now.AddDate(0, 0, -20)),
			mocks.MustStockMovement(t, userID, productID, enum.Restock, 20, 30, now.AddDate(0, 0, -10)),
			mocks.MustStockMovement(t, userID, productID, enum.Sold, 5, 25, now.AddDate(0, 0, -5)),
			mocks.MustStockMovement(t, userID, productID, enum.Broken, 1, 24, now.AddDate(0, 0, -2)),
		)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		// asc = true: the restock interval calculation depends on chronological order.
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, true).Return(movements, nil)

		dashboard, err := query.NewGetProductDashboardByProductIDHandler(repo).Handle(
			context.Background(),
			query.GetProductDashboardByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		require.NotNil(t, dashboard.ProductId)
		assert.Equal(t, product.Id().Value(), *dashboard.ProductId)
		require.NotNil(t, dashboard.ProductName)
		assert.Equal(t, "Kopi Susu", *dashboard.ProductName)
		assert.Equal(t, 10, dashboard.CurrentStock)
		require.NotNil(t, dashboard.StockThreshold)
		assert.Equal(t, 3, *dashboard.StockThreshold)
		require.NotNil(t, dashboard.CategoryId)
		assert.Equal(t, categoryID.Value(), *dashboard.CategoryId)
		require.NotNil(t, dashboard.ImageUrl)
		assert.Equal(t, "https://img", *dashboard.ImageUrl)

		volume := map[string]int{}
		for _, v := range dashboard.Volume {
			volume[v.Range] = v.TotalIn - v.TotalOut
		}
		assert.Equal(t, 34, volume["all"], "40 in minus 6 out")

		ratio := map[string]int{}
		for _, r := range dashboard.Ratio {
			ratio[r.Range] = r.TotalSold
		}
		assert.Equal(t, 5, ratio["all"])

		require.NotNil(t, dashboard.Depletion.DaysLeft)
		// 6 units over the last 30 days -> 0.2/day -> 10 / 0.2 = 50 days
		assert.Equal(t, 50, *dashboard.Depletion.DaysLeft)

		assert.Equal(t, 2, dashboard.RestockInterval.RestockCount)
		require.NotNil(t, dashboard.RestockInterval.AvgRestockIntervalDays)
		assert.InDelta(t, 10.0, *dashboard.RestockInterval.AvgRestockIntervalDays, 0.0001)

		repo.AssertExpectations(t)
	})

	t.Run("omits optional fields that are empty", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 4, 0, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, true).Return(movementsPtr(), nil)

		dashboard, err := query.NewGetProductDashboardByProductIDHandler(repo).Handle(
			context.Background(),
			query.GetProductDashboardByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		assert.Nil(t, dashboard.StockThreshold, "a zero threshold must not be reported")
		assert.Nil(t, dashboard.CategoryId)
		assert.Nil(t, dashboard.ImageUrl)
		assert.Nil(t, dashboard.Depletion.DaysLeft, "no outflow means no prediction")
		assert.Equal(t, 0, dashboard.RestockInterval.RestockCount)
		assert.Nil(t, dashboard.RestockInterval.AvgRestockIntervalDays)
	})
}
