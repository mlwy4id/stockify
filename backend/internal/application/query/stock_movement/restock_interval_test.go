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

/* ComputeRestockInterval assumes movements arrive ordered by date ascending, which is what
 * GetProductDashboardByProductID guarantees (repo is queried with asc=true). */
func Test_ComputeRestockInterval_Calculation_ExpectedIntervals(t *testing.T) {
	now := mocks.FixedTime()
	userID := vo.NewUserId()
	productID := vo.NewProductId()

	t.Run("no restock yet", func(t *testing.T) {
		result := stockmovement.ComputeRestockInterval(nil, now)

		assert.Equal(t, 0, result.RestockCount)
		assert.Nil(t, result.AvgRestockIntervalDays)
	})

	t.Run("a single restock has no interval", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 15, now.Add(-10*24*time.Hour)),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		assert.Equal(t, 1, result.RestockCount)
		assert.Nil(t, result.AvgRestockIntervalDays)
	})

	t.Run("averages the gap between restocks", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 5, now.Add(-20*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 10, now.Add(-10*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 15, now),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		require.NotNil(t, result.AvgRestockIntervalDays)
		assert.Equal(t, 3, result.RestockCount)
		assert.InDelta(t, 10.0, *result.AvgRestockIntervalDays, 0.0001)
	})

	t.Run("keeps one decimal", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 5, now.Add(-15*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 10, now.Add(-5*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 15, now),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		require.NotNil(t, result.AvgRestockIntervalDays)
		// gaps 10 and 5 -> 7.5
		assert.InDelta(t, 7.5, *result.AvgRestockIntervalDays, 0.0001)
	})

	t.Run("rounds the average to one decimal", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 5, now.Add(-20*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 10, now.Add(-10*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 15, now.Add(-3*24*time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 20, now),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		require.NotNil(t, result.AvgRestockIntervalDays)
		// gaps 10, 7 and 3 -> 20/3 = 6.666... -> 6.7
		assert.InDelta(t, 6.7, *result.AvgRestockIntervalDays, 0.0001)
	})

	t.Run("ignores other actions", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 5, 5, now.Add(-10*24*time.Hour)),
			newMovement(t, userID, productID, enum.Broken, 5, 0, now.Add(-5*24*time.Hour)),
			newMovement(t, userID, productID, enum.Refund, 5, 5, now.Add(-2*24*time.Hour)),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		assert.Equal(t, 0, result.RestockCount)
		assert.Nil(t, result.AvgRestockIntervalDays)
	})

	t.Run("only counts the last year", func(t *testing.T) {
		year := enum.Filter1y.Duration()

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 5, now.Add(-year-time.Second)),
			newMovement(t, userID, productID, enum.Restock, 5, 10, now.Add(-year)),
			newMovement(t, userID, productID, enum.Restock, 5, 15, now.Add(-10*24*time.Hour)),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		// The oldest restock falls outside the window; exactly one year old is kept.
		assert.Equal(t, 2, result.RestockCount)
		require.NotNil(t, result.AvgRestockIntervalDays)
		assert.InDelta(t, float64(355), *result.AvgRestockIntervalDays, 0.0001)
	})

	t.Run("future restocks are ignored", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 5, now.Add(time.Hour)),
			newMovement(t, userID, productID, enum.Restock, 5, 10, now.Add(2*time.Hour)),
		)

		result := stockmovement.ComputeRestockInterval(movements, now)

		assert.Equal(t, 0, result.RestockCount)
		assert.Nil(t, result.AvgRestockIntervalDays)
	})
}
