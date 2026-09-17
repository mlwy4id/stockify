package stockmovement_test

import (
	"testing"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
)

// rangeKeys is the fixed order emitted by every range-based analytics function
// (volume, sold/broken ratio): 1w, 1m, 3m, 6m, 1y, all.
var rangeKeys = []string{"1w", "1m", "3m", "6m", "1y", "all"}

// --- time helpers ---
// The Compute* helpers take `now` as a parameter, so those tests stay fully
// deterministic by passing fakes.FixedTime(). Only the *Handler tests (which call
// time.Now() internally) build timestamps relative to a captured `now`.

func startOfDay(ref time.Time) time.Time {
	return time.Date(ref.Year(), ref.Month(), ref.Day(), 0, 0, 0, 0, ref.Location())
}

func endOfDay(ref time.Time) time.Time {
	return time.Date(ref.Year(), ref.Month(), ref.Day(), 23, 59, 59, 0, ref.Location())
}

func hoursAgo(ref time.Time, hours int) time.Time {
	return ref.Add(-time.Duration(hours) * time.Hour)
}

// --- entity fixtures ---

func newMovement(t *testing.T, userID vo.UserId, productID vo.ProductId, action enum.Action, qty int, balance int, date time.Time) entity.StockMovement {
	t.Helper()
	return fakes.MustStockMovement(t, userID, productID, action, qty, balance, date)
}

func pointerMovements(ms ...entity.StockMovement) []*entity.StockMovement {
	out := make([]*entity.StockMovement, len(ms))
	for i := range ms {
		m := ms[i]
		out[i] = &m
	}
	return out
}

// --- assertion helpers ---

func rangeOrderOf(t *testing.T, ranges []string) {
	t.Helper()
	assert.Equal(t, rangeKeys, ranges)
}

func volumeMap(result []dto.StockMovementVolumeRangeDTO) map[string]dto.StockMovementVolumeRangeDTO {
	m := make(map[string]dto.StockMovementVolumeRangeDTO, len(result))
	for _, r := range result {
		m[r.Range] = r
	}
	return m
}

func ratioMap(result []dto.StockMovementSoldBrokenRatioRangeDTO) map[string]dto.StockMovementSoldBrokenRatioRangeDTO {
	m := make(map[string]dto.StockMovementSoldBrokenRatioRangeDTO, len(result))
	for _, r := range result {
		m[r.Range] = r
	}
	return m
}

func volumeRangeKeys(result []dto.StockMovementVolumeRangeDTO) []string {
	keys := make([]string, 0, len(result))
	for _, r := range result {
		keys = append(keys, r.Range)
	}
	return keys
}

func ratioRangeKeys(result []dto.StockMovementSoldBrokenRatioRangeDTO) []string {
	keys := make([]string, 0, len(result))
	for _, r := range result {
		keys = append(keys, r.Range)
	}
	return keys
}
