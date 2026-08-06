package stockmovement

import (
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
)

type soldBrokenRangeTotals struct {
	Range       string
	TotalSold   int
	TotalBroken int
}

func TotalSoldBrokenAll(movements []*entity.StockMovement, now time.Time) []dto.StockMovementSoldBrokenRatioRangeDTO {
	ranges := []struct {
		key      string
		duration time.Duration
		isAll    bool
	}{
		{"1w", enum.Filter1w.Duration(), false},
		{"1m", enum.Filter1m.Duration(), false},
		{"3m", enum.Filter3m.Duration(), false},
		{"6m", enum.Filter6m.Duration(), false},
		{"1y", enum.Filter1y.Duration(), false},
		{"all", 0, true},
	}

	totals := make([]soldBrokenRangeTotals, len(ranges))
	for i, r := range ranges {
		totals[i].Range = r.key
	}

	for _, m := range movements {
		if m.Date().After(now) {
			continue
		}

		qty := m.Quantity().Value()
		age := now.Sub(m.Date())

		for i, r := range ranges {
			if !r.isAll && age > r.duration {
				continue
			}

			switch m.Action() {
			case enum.Sold:
				totals[i].TotalSold += qty
			case enum.Broken:
				totals[i].TotalBroken += qty
			}
		}
	}

	result := make([]dto.StockMovementSoldBrokenRatioRangeDTO, len(totals))
	for i, t := range totals {
		totalOut := t.TotalSold + t.TotalBroken

		soldPercentage, brokenPercentage := 0.0, 0.0
		if totalOut > 0 {
			soldPercentage = roundPercentage(float64(t.TotalSold) / float64(totalOut) * 100)
			brokenPercentage = roundPercentage(float64(t.TotalBroken) / float64(totalOut) * 100)
		}

		result[i] = dto.StockMovementSoldBrokenRatioRangeDTO{
			Range:            t.Range,
			TotalSold:        t.TotalSold,
			TotalBroken:      t.TotalBroken,
			SoldPercentage:   soldPercentage,
			BrokenPercentage: brokenPercentage,
		}
	}

	return result
}
