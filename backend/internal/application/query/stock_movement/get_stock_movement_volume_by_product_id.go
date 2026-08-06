package stockmovement

import (
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
)

type volumeRangeTotals struct {
	Range    string
	TotalIn  int
	TotalOut int
}

func TotalInOutAll(movements []*entity.StockMovement, now time.Time) []dto.StockMovementVolumeRangeDTO {
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

	totals := make([]volumeRangeTotals, len(ranges))
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
			case enum.Restock, enum.Refund:
				totals[i].TotalIn += qty
			case enum.Sold, enum.Broken:
				totals[i].TotalOut += qty
			}
		}
	}

	result := make([]dto.StockMovementVolumeRangeDTO, len(totals))
	for i, t := range totals {
		result[i] = dto.StockMovementVolumeRangeDTO{
			Range:    t.Range,
			TotalIn:  t.TotalIn,
			TotalOut: t.TotalOut,
		}
	}

	return result
}
