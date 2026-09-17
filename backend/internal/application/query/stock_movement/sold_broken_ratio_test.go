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

func Test_TotalSoldBroken_Calculation_ExpectedRatio(t *testing.T) {
	now := mocks.FixedTime()
	userID := vo.NewUserId()
	productID := vo.NewProductId()

	t.Run("emits every range in a stable order", func(t *testing.T) {
		result := stockmovement.TotalSoldBrokenAll(nil, now)

		require.Len(t, result, len(rangeKeys))
		rangeOrderOf(t, ratioRangeKeys(result))
	})

	t.Run("zero totals produce zero percentages", func(t *testing.T) {
		result := stockmovement.TotalSoldBrokenAll(nil, now)

		for _, r := range result {
			assert.Equal(t, 0, r.TotalSold, "range %s", r.Range)
			assert.Equal(t, 0, r.TotalBroken, "range %s", r.Range)
			assert.InDelta(t, 0.0, r.SoldPercentage, 0.0001, "range %s", r.Range)
			assert.InDelta(t, 0.0, r.BrokenPercentage, 0.0001, "range %s", r.Range)
		}
	})

	t.Run("splits sold and broken inside each window", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 3, 0, now.Add(-3*24*time.Hour)),
			newMovement(t, userID, productID, enum.Broken, 1, 0, now.Add(-4*24*time.Hour)),
		)

		byRange := ratioMap(stockmovement.TotalSoldBrokenAll(movements, now))

		for _, key := range rangeKeys {
			assert.Equal(t, 3, byRange[key].TotalSold, "range %s", key)
			assert.Equal(t, 1, byRange[key].TotalBroken, "range %s", key)
			assert.InDelta(t, 75.0, byRange[key].SoldPercentage, 0.0001, "range %s", key)
			assert.InDelta(t, 25.0, byRange[key].BrokenPercentage, 0.0001, "range %s", key)
		}
	})

	t.Run("respects window boundaries", func(t *testing.T) {
		week := enum.Filter1w.Duration()

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 10, 0, now.Add(-week)),
			newMovement(t, userID, productID, enum.Sold, 20, 0, now.Add(-week-time.Second)),
			newMovement(t, userID, productID, enum.Broken, 5, 0, now.Add(-enum.Filter1y.Duration())),
		)

		byRange := ratioMap(stockmovement.TotalSoldBrokenAll(movements, now))

		// Exactly 7 days old is still inside 1w, one second more is not.
		assert.Equal(t, 10, byRange["1w"].TotalSold)
		assert.Equal(t, 0, byRange["1w"].TotalBroken)
		assert.Equal(t, 30, byRange["1m"].TotalSold)
		// Exactly 1 year old is still inside 1y.
		assert.Equal(t, 30, byRange["1y"].TotalSold)
		assert.Equal(t, 5, byRange["1y"].TotalBroken)
	})

	t.Run("movements older than a year only count in all", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 7, 0, now.Add(-enum.Filter1y.Duration()-time.Second)),
		)

		byRange := ratioMap(stockmovement.TotalSoldBrokenAll(movements, now))

		for _, key := range []string{"1w", "1m", "3m", "6m", "1y"} {
			assert.Equal(t, 0, byRange[key].TotalSold, "range %s", key)
		}
		assert.Equal(t, 7, byRange["all"].TotalSold)
	})

	t.Run("future movements are ignored", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 9, 0, now.Add(time.Hour)),
		)

		byRange := ratioMap(stockmovement.TotalSoldBrokenAll(movements, now))

		assert.Equal(t, 0, byRange["all"].TotalSold)
		assert.InDelta(t, 0.0, byRange["all"].SoldPercentage, 0.0001)
	})

	t.Run("percentages are rounded to two decimals", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Sold, 1, 0, hoursAgo(now, 1)),
			newMovement(t, userID, productID, enum.Broken, 2, 0, hoursAgo(now, 2)),
		)

		byRange := ratioMap(stockmovement.TotalSoldBrokenAll(movements, now))

		assert.InDelta(t, 33.33, byRange["all"].SoldPercentage, 0.0001)
		assert.InDelta(t, 66.67, byRange["all"].BrokenPercentage, 0.0001)
	})

	t.Run("inbound movements are not part of the ratio", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 50, 0, hoursAgo(now, 1)),
			newMovement(t, userID, productID, enum.Refund, 50, 0, hoursAgo(now, 2)),
			newMovement(t, userID, productID, enum.Sold, 1, 0, hoursAgo(now, 3)),
		)

		byRange := ratioMap(stockmovement.TotalSoldBrokenAll(movements, now))

		assert.Equal(t, 1, byRange["all"].TotalSold)
		assert.Equal(t, 0, byRange["all"].TotalBroken)
		assert.InDelta(t, 100.0, byRange["all"].SoldPercentage, 0.0001)
	})
}
