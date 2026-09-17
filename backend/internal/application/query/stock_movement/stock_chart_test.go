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

func Test_StockChartQuery_ErrorCases_RepoErrorsPropagated(t *testing.T) {
	userID := vo.NewUserId()
	boom := errors.New("boom")

	t.Run("movements query fails", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(nil, boom)

		_, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("total quantity query fails", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(0, boom)

		_, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("date range query fails", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(nil, boom)

		filter := enum.Filter1w
		_, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

func Test_StockChartQuery_WithoutMovements_EmptyChart(t *testing.T) {
	userID := vo.NewUserId()

	t.Run("returns a single point carrying the current balance", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(42, nil)

		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID},
		)

		require.NoError(t, err)
		require.Len(t, chart.Points, 1)
		assert.Equal(t, 42, chart.Points[0].Quantity)
		repo.AssertExpectations(t)
	})

	t.Run("an invalid date filter falls back to all movements", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(7, nil)

		invalid := enum.DateFilter("nope")
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &invalid},
		)

		require.NoError(t, err)
		assert.Equal(t, 7, chart.Points[len(chart.Points)-1].Quantity)
		repo.AssertNotCalled(t, "GetAllStockMovementsAndDateRange",
			mock.Anything, mock.Anything, mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})
}

func Test_StockChartQuery_DateFilterWindows_ExpectedWindows(t *testing.T) {
	userID := vo.NewUserId()

	t.Run("1d filter asks for today and yields two daily points", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		windowStart := startOfDay(time.Now()).Add(-24 * time.Hour)
		windowEnd := endOfDay(time.Now())

		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
			mock.MatchedBy(func(got time.Time) bool { return got.Equal(windowStart) }),
			mock.MatchedBy(func(got time.Time) bool { return got.Equal(windowEnd) }),
		).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(5, nil)

		filter := enum.Filter1d
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)
		require.Len(t, chart.Points, 2)
		assert.True(t, chart.Points[0].Date.Equal(startOfDay(time.Now())), "first boundary = %v", chart.Points[0].Date)
		assert.True(t, chart.Points[1].Date.Equal(windowEnd), "last boundary = %v", chart.Points[1].Date)
		assert.Equal(t, 5, chart.Points[0].Quantity)
		assert.Equal(t, 5, chart.Points[1].Quantity)
		repo.AssertExpectations(t)
	})

	t.Run("1m filter buckets one point per day", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(0, nil)

		filter := enum.Filter1m
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)
		// 30 days of window -> 30 daily boundaries plus the end of today
		require.Len(t, chart.Points, 31)
	})

	t.Run("3m filter buckets per week starting on monday", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(0, nil)

		filter := enum.Filter3m
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)
		require.Greater(t, len(chart.Points), 2)

		for i := 0; i < len(chart.Points)-1; i++ {
			p := chart.Points[i]
			assert.Equal(t, time.Monday, p.Date.Weekday(), "point %d date = %v", i, p.Date)
			assert.Equal(t, 0, p.Date.Hour(), "point %d date = %v", i, p.Date)
		}
		assert.True(t, chart.Points[len(chart.Points)-1].Date.Equal(endOfDay(time.Now())))
	})

	t.Run("1y filter buckets per month", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(pointerMovements(), nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(0, nil)

		// The window is 365 days plus the hours already elapsed today, so the span ends up
		// just above 365 days and lands in the monthly bucket (> 365 days), not the weekly one.
		filter := enum.Filter1y
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)
		require.Greater(t, len(chart.Points), 2)

		for i := 0; i < len(chart.Points)-1; i++ {
			p := chart.Points[i]
			assert.Equal(t, 1, p.Date.Day(), "point %d should start a month: %v", i, p.Date)
			assert.Equal(t, 0, p.Date.Hour(), "point %d should start a month: %v", i, p.Date)
		}
		assert.True(t, chart.Points[len(chart.Points)-1].Date.Equal(endOfDay(time.Now())))
	})
}
func Test_StockChartQuery_BucketingWithoutFilter_ExpectedBuckets(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()

	t.Run("a span beyond a year buckets per month", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		date := time.Now().AddDate(0, 0, -400)
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 10, 30, date),
		)

		repo.On("GetAllStockMovements", mock.Anything, userID).Return(movements, nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(30, nil)

		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID},
		)

		require.NoError(t, err)
		require.Greater(t, len(chart.Points), 2)

		for i := 0; i < len(chart.Points)-1; i++ {
			assert.Equal(t, 1, chart.Points[i].Date.Day(), "point %d should start a month: %v", i, chart.Points[i].Date)
			assert.Equal(t, 0, chart.Points[i].Date.Hour(), "point %d should start a month: %v", i, chart.Points[i].Date)
		}
		assert.Equal(t, 30, chart.Points[0].Quantity)
		assert.Equal(t, 30, chart.Points[len(chart.Points)-1].Quantity)
	})

	t.Run("carries the previous balance into empty buckets", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 5, 25, time.Now().AddDate(0, 0, -10)),
		)

		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(movements, nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(25, nil)

		filter := enum.Filter1m
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)
		require.Greater(t, len(chart.Points), 11)

		// Before the sale the balance must stay at startBalance = 25 + 5 = 30.
		assert.Equal(t, 30, chart.Points[0].Quantity)
		// After the sale every later bucket carries the new balance forward.
		assert.Equal(t, 25, chart.Points[len(chart.Points)-1].Quantity)
	})

	t.Run("orders movements ascending before accumulating", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		// The SQL query returns newest first; the handler has to sort ascending,
		// otherwise the running balance is applied in the wrong order.
		newest := newMovement(t, userID, productID, enum.Sold, 5, 25, time.Now().AddDate(0, 0, -5))
		oldest := newMovement(t, userID, productID, enum.Restock, 10, 30, time.Now().AddDate(0, 0, -10))
		movements := pointerMovements(newest, oldest)

		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(movements, nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(25, nil)

		filter := enum.Filter1m
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)

		assert.Equal(t, 20, chart.Points[0].Quantity, "startBalance = currentBalance - netStockChange")

		peak := 0
		for _, p := range chart.Points {
			if p.Quantity > peak {
				peak = p.Quantity
			}
		}
		// The restock happens before the sale, so the peak must be 20 + 10 = 30.
		assert.Equal(t, 30, peak)
		assert.Equal(t, 25, chart.Points[len(chart.Points)-1].Quantity)
	})

	t.Run("a span between half a year and a year buckets per week", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 15, time.Now().AddDate(0, 0, -200)),
		)

		repo.On("GetAllStockMovements", mock.Anything, userID).Return(movements, nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(15, nil)

		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID},
		)

		require.NoError(t, err)
		require.Greater(t, len(chart.Points), 2)

		for i := 0; i < len(chart.Points)-1; i++ {
			assert.Equal(t, time.Monday, chart.Points[i].Date.Weekday(), "point %d date = %v", i, chart.Points[i].Date)
		}
	})

	t.Run("an unknown action does not move the balance", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		// Reconstruct bypasses validation, which is how a legacy action can reach the query layer.
		unknown := fakes.MustStockMovement(t, userID, productID, enum.Action("UNKNOWN"), 5, 20, time.Now().AddDate(0, 0, -10))
		movements := pointerMovements(unknown)

		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(movements, nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(20, nil)

		filter := enum.Filter1m
		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID, DateFilter: &filter},
		)

		require.NoError(t, err)
		for _, p := range chart.Points {
			assert.Equal(t, 20, p.Quantity, "date %v", p.Date)
		}
	})

	t.Run("a future dated movement does not break the chart", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 25, time.Now().AddDate(0, 0, 2)),
		)

		repo.On("GetAllStockMovements", mock.Anything, userID).Return(movements, nil)
		repo.On("GetTotalQuantity", mock.Anything, userID).Return(20, nil)

		chart, err := stockmovement.NewGetStockChartHandler(repo).Handle(
			context.Background(), stockmovement.GetStockChartQuery{UserId: userID},
		)

		require.NoError(t, err)
		require.Len(t, chart.Points, 1)
		assert.Equal(t, 20, chart.Points[0].Quantity)
	})
}
