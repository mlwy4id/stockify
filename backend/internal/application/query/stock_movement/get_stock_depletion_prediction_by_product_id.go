package stockmovement

import (
	"math"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
)

func ComputeDepletion(currentStock int, movements []*entity.StockMovement, now time.Time) dto.StockDepletionPredictionDTO {
	window := enum.Filter1m.Duration()

	totalOut := totalOutflowWindow(movements, now, window)
	if totalOut == 0 {
		return dto.StockDepletionPredictionDTO{}
	}

	avgDailyOut := float64(totalOut) / (window.Hours() / 24)
	daysLeft := int(math.Ceil(float64(currentStock) / avgDailyOut))
	estimatedDate := now.Add(time.Duration(daysLeft) * 24 * time.Hour)

	return dto.StockDepletionPredictionDTO{
		AvgDailyOut:   &avgDailyOut,
		DaysLeft:      &daysLeft,
		EstimatedDate: &estimatedDate,
	}
}

func totalOutflowWindow(movements []*entity.StockMovement, now time.Time, window time.Duration) int {
	start := now.Add(-window)
	total := 0

	for _, m := range movements {
		if m.Date().Before(start) || m.Date().After(now) {
			continue
		}

		switch m.Action() {
		case enum.Sold, enum.Broken:
			total += m.Quantity().Value()
		}
	}

	return total
}
