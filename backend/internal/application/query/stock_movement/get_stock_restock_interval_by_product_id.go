package stockmovement

import (
	"math"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
)

func ComputeRestockInterval(movements []*entity.StockMovement, now time.Time) dto.StockRestockIntervalDTO {
	dates := restockDatesInWindow(movements, now, enum.Filter1y.Duration())

	result := dto.StockRestockIntervalDTO{
		RestockCount: len(dates),
	}

	if len(dates) < 2 {
		return result
	}

	totalGapDays := 0.0
	for i := 1; i < len(dates); i++ {
		totalGapDays += dates[i].Sub(dates[i-1]).Hours() / 24
	}

	avg := math.Round((totalGapDays/float64(len(dates)-1))*10) / 10
	result.AvgRestockIntervalDays = &avg

	return result
}

func restockDatesInWindow(movements []*entity.StockMovement, now time.Time, window time.Duration) []time.Time {
	start := now.Add(-window)
	dates := make([]time.Time, 0)

	for _, m := range movements {
		if m.Action() != enum.Restock {
			continue
		}

		d := m.Date()
		if d.Before(start) || d.After(now) {
			continue
		}

		dates = append(dates, d)
	}

	return dates
}
