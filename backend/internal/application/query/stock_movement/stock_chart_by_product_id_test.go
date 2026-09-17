package stockmovement_test

import (
	"context"
	"errors"
	"testing"
	"time"

	stockmovement "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_StockChartByProductIDQuery_ErrorCases_RepoErrorsPropagated(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	t.Run("product is not found", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(nil, boom)

		_, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("movements query fails", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(nil, boom)

		_, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("ranged movements query fails", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductIDAndDateRange", mock.Anything, userID, productID, mock.Anything, mock.Anything).
			Return(nil, boom)

		filter := enum.Filter1m
		_, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID, DateFilter: &filter},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

func Test_StockChartByProductIDQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()

	t.Run("without movements returns the product stock as single point", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi Susu", "", 12, 3, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(pointerMovements(), nil)

		chart, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		require.Len(t, chart.Points, 1)
		assert.Equal(t, 12, chart.Points[0].Quantity)
		require.NotNil(t, chart.ProductId)
		assert.Equal(t, product.Id().Value(), *chart.ProductId)
		require.NotNil(t, chart.ProductName)
		assert.Equal(t, "Kopi Susu", *chart.ProductName)
		repo.AssertExpectations(t)
	})

	t.Run("sorts the movements it gets back and starts at the oldest one", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 25, 3, nil)

		newest := newMovement(t, userID, productID, enum.Sold, 5, 25, hoursAgo(time.Now(), 2))
		oldest := newMovement(t, userID, productID, enum.Restock, 10, 30, hoursAgo(time.Now(), 3))
		movements := pointerMovements(newest, oldest) // repository returns newest first

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(movements, nil)

		chart, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		// The window starts at the oldest movement (3 hours ago), so only the daily
		// buckets covering that span exist. A zero start would explode into thousands of points.
		require.NotEmpty(t, chart.Points)
		assert.Less(t, len(chart.Points), 5)
		// startBalance = 25 - (10 - 5) = 20, ending at the current product quantity.
		assert.Equal(t, 25, chart.Points[len(chart.Points)-1].Quantity)
		repo.AssertExpectations(t)
	})

	t.Run("without filter asks the repository for oldest first", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 15, 3, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		// asc = false on purpose: the handler sorts ascending itself.
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(pointerMovements(), nil)

		_, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("start balance is derived from the current product stock", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 15, 3, nil)

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 5, 15, time.Now().AddDate(0, 0, -10)),
		)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("GetStockMovementsByProductIDAndDateRange", mock.Anything, userID, productID, mock.Anything, mock.Anything).
			Return(movements, nil)

		filter := enum.Filter1m
		chart, err := stockmovement.NewGetStockChartByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockChartByProductIDQuery{UserId: userID, ProductId: productID, DateFilter: &filter},
		)

		require.NoError(t, err)
		require.Greater(t, len(chart.Points), 11)
		// startBalance = 15 (current) + 5 (already sold) = 20
		assert.Equal(t, 20, chart.Points[0].Quantity)
		assert.Equal(t, 15, chart.Points[len(chart.Points)-1].Quantity)
		repo.AssertExpectations(t)
	})
}
