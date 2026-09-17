package stockmovement_test

import (
	"testing"
	"time"

	stockmovement "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ComputeDepletion_Calculation_ExpectedWindows(t *testing.T) {
	now := mocks.FixedTime()
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	window := enum.Filter1m.Duration()

	t.Run("empty prediction without outflow", func(t *testing.T) {
		result := stockmovement.ComputeDepletion(10, nil, now)

		assert.Nil(t, result.AvgDailyOut)
		assert.Nil(t, result.DaysLeft)
		assert.Nil(t, result.EstimatedDate)
	})

	t.Run("ignores inbound movements", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 100, 120, hoursAgo(now, 2)),
			newMovement(t, userID, productID, enum.Refund, 5, 125, hoursAgo(now, 3)),
			newMovement(t, userID, productID, enum.Sold, 15, 110, hoursAgo(now, 4)),
		)

		result := stockmovement.ComputeDepletion(400, movements, now)

		require.NotNil(t, result.AvgDailyOut)
		assert.InDelta(t, 0.5, *result.AvgDailyOut, 0.0001)
		require.NotNil(t, result.DaysLeft)
		assert.Equal(t, 800, *result.DaysLeft)
	})

	t.Run("counts sold and broken as outflow", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 18, 0, hoursAgo(now, 2)),
			newMovement(t, userID, productID, enum.Broken, 12, 0, hoursAgo(now, 3)),
		)

		result := stockmovement.ComputeDepletion(30, movements, now)

		require.NotNil(t, result.AvgDailyOut)
		assert.InDelta(t, 1.0, *result.AvgDailyOut, 0.0001)
		require.NotNil(t, result.DaysLeft)
		assert.Equal(t, 30, *result.DaysLeft)
		require.NotNil(t, result.EstimatedDate)
		assert.True(t, result.EstimatedDate.Equal(now.Add(30*24*time.Hour)), "estimatedDate = %v", result.EstimatedDate)
	})

	t.Run("a movement exactly at the window edge is inside", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 30, 0, now.Add(-window)),
		)

		result := stockmovement.ComputeDepletion(60, movements, now)

		require.NotNil(t, result.AvgDailyOut)
		assert.InDelta(t, 1.0, *result.AvgDailyOut, 0.0001)
		require.NotNil(t, result.DaysLeft)
		assert.Equal(t, 60, *result.DaysLeft)
	})

	t.Run("ignores movements outside the window", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 300, 0, now.Add(-window-time.Second)),
		)

		result := stockmovement.ComputeDepletion(50, movements, now)

		assert.Nil(t, result.DaysLeft)
		assert.Nil(t, result.AvgDailyOut)
	})

	t.Run("ignores future movements", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 30, 0, now.Add(time.Hour)),
		)

		result := stockmovement.ComputeDepletion(50, movements, now)

		assert.Nil(t, result.DaysLeft)
		assert.Nil(t, result.AvgDailyOut)
	})

	t.Run("rounds the remaining days up", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 4, 0, hoursAgo(now, 1)),
		)

		result := stockmovement.ComputeDepletion(1, movements, now)

		require.NotNil(t, result.AvgDailyOut)
		require.NotNil(t, result.DaysLeft)
		// 1 / (4/30) = 7.5 -> 8 whole days
		assert.Equal(t, 8, *result.DaysLeft)
	})

	t.Run("empty stock depletes today", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 30, 0, hoursAgo(now, 1)),
		)

		result := stockmovement.ComputeDepletion(0, movements, now)

		require.NotNil(t, result.DaysLeft)
		assert.Equal(t, 0, *result.DaysLeft)
		require.NotNil(t, result.EstimatedDate)
		assert.True(t, result.EstimatedDate.Equal(now), "estimatedDate = %v, want %v", result.EstimatedDate, now)
	})
}
