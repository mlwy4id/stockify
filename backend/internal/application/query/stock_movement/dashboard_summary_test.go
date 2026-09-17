package stockmovement_test

import (
	"context"
	"errors"
	"testing"
	"time"

	stockmovement "github.com/mlwy4id/stockify/internal/application/query/stock_movement"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

// dashboardWindows mirrors the windows the handler compares: today (current) and the
// equally long period right before it (previous).
func dashboardWindows(now time.Time) (currentStart, currentEnd, prevStart, prevEnd time.Time) {
	currentStart = startOfDay(now).Add(-24 * time.Hour)
	currentEnd = endOfDay(now)
	period := currentEnd.Sub(currentStart)
	prevStart = currentStart.Add(-period)
	prevEnd = currentStart
	return
}

func Test_DashboardSummaryQuery_ErrorCases_RepoErrorsPropagated(t *testing.T) {
	userID := vo.NewUserId()
	boom := errors.New("boom")

	t.Run("active products query fails", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return(nil, boom)

		_, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("today window query fails", func(t *testing.T) {
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)
		_, _, _, _ = dashboardWindows(time.Now())

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).Return(nil, boom)

		_, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("previous window query fails", func(t *testing.T) {
		now := time.Now()
		currentStart, _, prevStart, _ := dashboardWindows(now)
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
			mock.MatchedBy(func(got time.Time) bool { return got.Equal(currentStart) }), mock.Anything).
			Return(pointerMovements(), nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
			mock.MatchedBy(func(got time.Time) bool { return got.Equal(prevStart) }), mock.Anything).
			Return(nil, boom)

		_, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("all movements query fails", func(t *testing.T) {
		now := time.Now()
		currentStart, _, prevStart, _ := dashboardWindows(now)
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
			mock.MatchedBy(func(got time.Time) bool { return got.Equal(currentStart) }), mock.Anything).
			Return(pointerMovements(), nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
			mock.MatchedBy(func(got time.Time) bool { return got.Equal(prevStart) }), mock.Anything).
			Return(pointerMovements(), nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(nil, boom)

		_, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

// newSummaryRepo wires both windowed queries (current + previous) and the "all movements"
// query used for volume/ratio. Windows are matched on their start so expectations stay
// unambiguous, and AssertExpectations proves both windows were actually requested.
func newSummaryRepo(t *testing.T, userID vo.UserId, current, previous, all []*entity.StockMovement) *fakes.MockProductRepository {
	t.Helper()
	currentStart, _, prevStart, _ := dashboardWindows(time.Now())

	repo := new(fakes.MockProductRepository)
	repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
		mock.MatchedBy(func(got time.Time) bool { return got.Equal(currentStart) }), mock.Anything).
		Return(current, nil)
	repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID,
		mock.MatchedBy(func(got time.Time) bool { return got.Equal(prevStart) }), mock.Anything).
		Return(previous, nil)
	repo.On("GetAllStockMovements", mock.Anything, userID).Return(all, nil)
	return repo
}

func Test_DashboardSummaryQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()

	t.Run("summarises the current window against the previous one", func(t *testing.T) {
		now := time.Now()
		currentStart, _, prevStart, _ := dashboardWindows(now)
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)
		tea := fakes.MustProductFull(t, userID, "Teh", "", 5, 2, nil)

		currentMovements := pointerMovements(
			newMovement(t, userID, coffee.Id(), enum.Restock, 8, 18, currentStart.Add(2*time.Hour)),
			newMovement(t, userID, coffee.Id(), enum.Sold, 3, 15, currentStart.Add(3*time.Hour)),
			newMovement(t, userID, coffee.Id(), enum.Broken, 1, 14, currentStart.Add(4*time.Hour)),
		)
		previousMovements := pointerMovements(
			newMovement(t, userID, coffee.Id(), enum.Restock, 4, 14, prevStart.Add(2*time.Hour)),
			newMovement(t, userID, coffee.Id(), enum.Sold, 2, 12, prevStart.Add(3*time.Hour)),
		)
		all := append(append(pointerMovements(), currentMovements...), previousMovements...)

		repo := newSummaryRepo(t, userID, currentMovements, previousMovements, all)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee, &tea}, nil)

		summary, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.NoError(t, err)
		assert.Equal(t, 2, summary.TotalActiveProduct)
		assert.Equal(t, 15, summary.TotalQuantity)
		assert.Equal(t, 8, summary.TotalIn)
		assert.Equal(t, 4, summary.TotalOut)
		assert.InDelta(t, 100.0, summary.InChangePercentage, 0.0001)
		assert.InDelta(t, 100.0, summary.OutChangePercentage, 0.0001)

		volume := volumeMap(summary.Volume)
		assert.Equal(t, 12, volume["all"].TotalIn)
		assert.Equal(t, 6, volume["all"].TotalOut)

		ratio := ratioMap(summary.Ratio)
		assert.Equal(t, 5, ratio["all"].TotalSold)
		assert.Equal(t, 1, ratio["all"].TotalBroken)
		assert.InDelta(t, 83.33, ratio["all"].SoldPercentage, 0.0001)

		repo.AssertExpectations(t)
	})

	t.Run("growth from an empty previous window is reported as 100 percent", func(t *testing.T) {
		now := time.Now()
		currentStart, _, _, _ := dashboardWindows(now)
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		currentMovements := pointerMovements(
			newMovement(t, userID, coffee.Id(), enum.Restock, 5, 15, currentStart.Add(2*time.Hour)),
		)

		repo := newSummaryRepo(t, userID, currentMovements, pointerMovements(), currentMovements)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)

		summary, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.NoError(t, err)
		assert.Equal(t, 5, summary.TotalIn)
		assert.Equal(t, 0, summary.TotalOut)
		assert.InDelta(t, 100.0, summary.InChangePercentage, 0.0001)
		assert.InDelta(t, 0.0, summary.OutChangePercentage, 0.0001)

		repo.AssertExpectations(t)
	})

	t.Run("a silent period reports zero change", func(t *testing.T) {
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := newSummaryRepo(t, userID, pointerMovements(), pointerMovements(), pointerMovements())
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)

		summary, err := stockmovement.NewGetDashboardStockMovementSummaryHandler(repo).Handle(
			context.Background(), stockmovement.GetDashboardStockMovementSummaryQuery{UserId: userID},
		)

		require.NoError(t, err)
		assert.Equal(t, 0, summary.TotalIn)
		assert.Equal(t, 0, summary.TotalOut)
		assert.InDelta(t, 0.0, summary.InChangePercentage, 0.0001)
		assert.InDelta(t, 0.0, summary.OutChangePercentage, 0.0001)

		repo.AssertExpectations(t)
	})
}
