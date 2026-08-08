package stockmovement

import (
	"math"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
)

func roundPercentage(value float64) float64 {
	return math.Round(value*100) / 100
}

func dateRangeFor(now time.Time, filter *enum.DateFilter) (time.Time, time.Time) {
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()).Add(-filter.Duration())
	end := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 0, now.Location())
	return start, end
}
