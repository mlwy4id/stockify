package product

import (
	"context"
	"sort"
	"time"

	"github.com/mlwy4id/stockify/internal/application/dto"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetStockChartQuery struct {
	UserId     vo.UserId
	DateFilter *enum.DateFilter
}

type GetStockChartHandler struct {
	productRepo repo.ProductRepository
}

func NewGetStockChartHandler(productRepo repo.ProductRepository) *GetStockChartHandler {
	return &GetStockChartHandler{productRepo: productRepo}
}

func (h *GetStockChartHandler) Handle(ctx context.Context, query GetStockChartQuery) (dto.StockChartDTO, error) {
	now := time.Now()

	var movements []*entity.StockMovement
	var err error
	start := time.Time{}

	if query.DateFilter != nil && query.DateFilter.IsValid() {
		start = now.Add(-query.DateFilter.Duration())
		movements, err = h.productRepo.GetAllStockMovementsAndDateRange(ctx, query.UserId, start, now)
	} else {
		movements, err = h.productRepo.GetAllStockMovements(ctx, query.UserId)
	}

	if err != nil {
		return dto.StockChartDTO{}, err
	}

	sort.Slice(movements, func(i, j int) bool {
		return movements[i].Date().Before(movements[j].Date())
	})

	currentBalance, err := h.productRepo.GetTotalQuantity(ctx, query.UserId)
	if err != nil {
		return dto.StockChartDTO{}, err
	}

	if start.IsZero() {
		if len(movements) == 0 {
			return dto.StockChartDTO{
				Points: []dto.StockChartPointDTO{{Date: now, Quantity: currentBalance}},
			}, nil
		}

		start = movements[0].Date()
	}

	startBalance := currentBalance - netStockChange(movements)
	bucket := bucketSizeFor(now.Sub(start))
	points := buildChartPoints(start, now, startBalance, movements, bucket)

	return dto.StockChartDTO{Points: points}, nil
}

func netStockChange(movements []*entity.StockMovement) int {
	total := 0
	for _, m := range movements {
		total += stockDelta(m)
	}
	return total
}

func stockDelta(m *entity.StockMovement) int {
	qty := m.Quantity().Value()
	switch m.Action() {
	case enum.Restock, enum.Refund:
		return qty
	case enum.Sold, enum.Broken:
		return -qty
	default:
		return 0
	}
}

/*
 * bucketSizeFor menentukan ukuran interval chart berdasarkan panjang rentang waktu (span),
 * biar jumlah titik chart gak kebanyakan kalau rentangnya panjang:
 *  <= 90 hari   -> per hari
 *  <= 180 hari  -> per minggu
 *  <= 365 hari  -> per minggu
 *  > 365 hari   -> per bulan (30 hari) 
*/
func bucketSizeFor(span time.Duration) time.Duration {
	day := 24 * time.Hour
	week := 7 * day

	switch {
	case span <= 90*day:
		return day
	case span <= 180*day:
		return week
	case span <= 365*day:
		return week
	default:
		return 30 * day
	}
}

/*
 * alignToBucketStart mengatur waktu ke awal bucket (misalnya, ke awal hari atau minggu) berdasarkan ukuran bucket yang ditentukan.
 * Misalnya, jika bucket adalah 7*24*time.Hour, maka waktu akan diatur ke awal minggu (senin).
 * Jika bucket adalah 30*24*time.Hour, maka waktu akan diatur ke awal bulan (1 hari ke depan).
 * Jika bucket harian, waktu akan diatur ke awal hari (0 jam, 0 menit, 0 detik).
 */
func alignToBucketStart(t time.Time, bucket time.Duration) time.Time {
	switch bucket {
	case 7 * 24 * time.Hour:
		daysSinceMonday := (int(t.Weekday()) + 6) % 7
		startOfDay := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
		return startOfDay.AddDate(0, 0, -daysSinceMonday)
	case 30 * 24 * time.Hour:
		return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, t.Location())
	default:
		return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
	}
}

func nextBucketEnd(t time.Time, bucket time.Duration) time.Time {
	if bucket == 30*24*time.Hour {
		return t.AddDate(0, 1, 0)
	}
	return t.Add(bucket)
}

/*
 * Alur build chart:
 * - Membangun boundaries (batas akhir tiap bucket) dari start hingga end
 * - Taruh tiap movement ke bucket yang sesuai & hitung running balance 
 * - Isi titik yang tidak memiliki stock movement dengan carry-forward dari balance terakhir (bucket sebelumnya)
 */
func buildChartPoints(start time.Time, end time.Time, startBalance int, movements []*entity.StockMovement, bucket time.Duration) []dto.StockChartPointDTO {
	boundaries := []time.Time{}
	cursor := alignToBucketStart(start, bucket)

	for cursor.Before(end) {
		cursor = nextBucketEnd(cursor, bucket)

		if cursor.After(end) {
			boundaries = append(boundaries, end)
			break
		}

		boundaries = append(boundaries, cursor)
	}

	if len(boundaries) == 0 {
		boundaries = append(boundaries, end)
	}

	values := make([]int, len(boundaries))
	filled := make([]bool, len(boundaries))

	balance := startBalance

	for _, m := range movements {
		balance += stockDelta(m)

		idx := sort.Search(len(boundaries), func(i int) bool { return !m.Date().After(boundaries[i]) })
		if idx >= len(boundaries) {
			idx = len(boundaries) - 1
		}

		values[idx] = balance
		filled[idx] = true
	}

	points := make([]dto.StockChartPointDTO, 0, len(boundaries))
	carry := startBalance

	for i, boundary := range boundaries {
		if filled[i] {
			carry = values[i]
		}

		points = append(points, dto.StockChartPointDTO{
			Date:     boundary,
			Quantity: carry,
		})
	}

	return points
}
