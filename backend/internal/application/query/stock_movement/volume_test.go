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

func Test_TotalInOut_Calculation_ExpectedVolumes(t *testing.T) {
	now := mocks.FixedTime()
	userID := vo.NewUserId()
	productID := vo.NewProductId()

	t.Run("emits every range in a stable order", func(t *testing.T) {
		result := stockmovement.TotalInOutAll(nil, now)

		require.Len(t, result, len(rangeKeys))
		rangeOrderOf(t, volumeRangeKeys(result))
	})

	t.Run("returns zeros when there are no movements", func(t *testing.T) {
		result := stockmovement.TotalInOutAll(nil, now)

		for _, r := range result {
			assert.Equal(t, 0, r.TotalIn, "range %s", r.Range)
			assert.Equal(t, 0, r.TotalOut, "range %s", r.Range)
		}
	})

	t.Run("restock and refund are in, sold and broken are out", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 15, hoursAgo(now, 2)),
			newMovement(t, userID, productID, enum.Refund, 2, 17, hoursAgo(now, 3)),
			newMovement(t, userID, productID, enum.Sold, 4, 13, hoursAgo(now, 4)),
			newMovement(t, userID, productID, enum.Broken, 1, 12, hoursAgo(now, 5)),
		)

		byRange := volumeMap(stockmovement.TotalInOutAll(movements, now))

		for _, key := range rangeKeys {
			assert.Equal(t, 7, byRange[key].TotalIn, "range %s", key)
			assert.Equal(t, 5, byRange[key].TotalOut, "range %s", key)
		}
	})

	t.Run("respects window boundaries", func(t *testing.T) {
		week := enum.Filter1w.Duration()

		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 10, 10, now.Add(-week)),
			newMovement(t, userID, productID, enum.Restock, 20, 30, now.Add(-week-time.Second)),
			newMovement(t, userID, productID, enum.Sold, 5, 25, now.Add(-enum.Filter1y.Duration())),
		)

		byRange := volumeMap(stockmovement.TotalInOutAll(movements, now))

		// Exactly 7 days old is still inside the 1w window, one second more is not.
		assert.Equal(t, 10, byRange["1w"].TotalIn)
		assert.Equal(t, 0, byRange["1w"].TotalOut)
		assert.Equal(t, 30, byRange["1m"].TotalIn)
		// Exactly 1 year old is still inside the 1y window.
		assert.Equal(t, 5, byRange["1y"].TotalOut)
		assert.Equal(t, 30, byRange["all"].TotalIn)
		assert.Equal(t, 5, byRange["all"].TotalOut)
	})

	t.Run("movements older than a year only count in all", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 7, 7, now.Add(-enum.Filter1y.Duration()-time.Second)),
		)

		byRange := volumeMap(stockmovement.TotalInOutAll(movements, now))

		for _, key := range []string{"1w", "1m", "3m", "6m", "1y"} {
			assert.Equal(t, 0, byRange[key].TotalIn, "range %s", key)
		}
		assert.Equal(t, 7, byRange["all"].TotalIn)
	})

	t.Run("future movements are ignored", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 9, 9, now.Add(time.Hour)),
		)

		byRange := volumeMap(stockmovement.TotalInOutAll(movements, now))

		assert.Equal(t, 0, byRange["all"].TotalIn)
	})
}
