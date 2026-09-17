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

func Test_TopMoversQuery_ErrorCases_RepoErrorsPropagated(t *testing.T) {
	userID := vo.NewUserId()
	boom := errors.New("boom")

	t.Run("active products query fails", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return(nil, boom)

		_, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("movements query fails", func(t *testing.T) {
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(nil, boom)

		_, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

func Test_TopMoversQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()

	t.Run("aggregates in and out per active product and sorts by outflow", func(t *testing.T) {
		now := time.Now()
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)
		tea := fakes.MustProductFull(t, userID, "Teh", "", 8, 2, nil)

		movements := pointerMovements(
			newMovement(t, userID, coffee.Id(), enum.Sold, 6, 4, hoursAgo(now, 1)),
			newMovement(t, userID, coffee.Id(), enum.Restock, 10, 14, hoursAgo(now, 2)),
			newMovement(t, userID, tea.Id(), enum.Sold, 2, 6, hoursAgo(now, 3)),
			newMovement(t, userID, tea.Id(), enum.Broken, 1, 5, hoursAgo(now, 4)),
			newMovement(t, userID, vo.NewProductId(), enum.Sold, 99, 0, hoursAgo(now, 5)),
		)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee, &tea}, nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(movements, nil)

		movers, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID, Limit: 10},
		)

		require.NoError(t, err)
		require.Len(t, movers, 2)

		assert.Equal(t, coffee.Id().Value(), movers[0].ProductId)
		assert.Equal(t, "Kopi", movers[0].ProductName)
		assert.Equal(t, 10, movers[0].TotalIn)
		assert.Equal(t, 6, movers[0].TotalOut)

		assert.Equal(t, tea.Id().Value(), movers[1].ProductId)
		assert.Equal(t, 0, movers[1].TotalIn)
		assert.Equal(t, 3, movers[1].TotalOut)

		repo.AssertExpectations(t)
	})

	t.Run("keeps products without movements at zero", func(t *testing.T) {
		now := time.Now()
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)
		tea := fakes.MustProductFull(t, userID, "Teh", "", 8, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee, &tea}, nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(
			newMovement(t, userID, coffee.Id(), enum.Sold, 4, 6, hoursAgo(now, 1)),
		), nil)

		movers, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID},
		)

		require.NoError(t, err)
		require.Len(t, movers, 2)

		zeros := movers[1]
		assert.Equal(t, tea.Id().Value(), zeros.ProductId)
		assert.Equal(t, 0, zeros.TotalIn)
		assert.Equal(t, 0, zeros.TotalOut)
	})

	t.Run("limit truncates after sorting", func(t *testing.T) {
		now := time.Now()
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)
		tea := fakes.MustProductFull(t, userID, "Teh", "", 8, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee, &tea}, nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(
			newMovement(t, userID, tea.Id(), enum.Sold, 9, 0, hoursAgo(now, 1)),
			newMovement(t, userID, coffee.Id(), enum.Sold, 4, 6, hoursAgo(now, 2)),
		), nil)

		movers, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID, Limit: 1},
		)

		require.NoError(t, err)
		require.Len(t, movers, 1)
		assert.Equal(t, "Teh", movers[0].ProductName)
		assert.Equal(t, 9, movers[0].TotalOut)
	})

	t.Run("a limit above the product count returns everything", func(t *testing.T) {
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(), nil)

		movers, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID, Limit: 50},
		)

		require.NoError(t, err)
		assert.Len(t, movers, 1)
	})

	t.Run("non positive limit returns everything", func(t *testing.T) {
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)
		tea := fakes.MustProductFull(t, userID, "Teh", "", 8, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee, &tea}, nil)
		repo.On("GetAllStockMovements", mock.Anything, userID).Return(pointerMovements(), nil)

		movers, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID, Limit: -5},
		)

		require.NoError(t, err)
		assert.Len(t, movers, 2)
	})

	t.Run("a valid date filter switches to the ranged query", func(t *testing.T) {
		coffee := fakes.MustProductFull(t, userID, "Kopi", "", 10, 2, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)
		repo.On("GetAllStockMovementsAndDateRange", mock.Anything, userID, mock.Anything, mock.Anything).
			Return(pointerMovements(), nil)

		filter := enum.Filter1w
		_, err := stockmovement.NewGetTopMoversHandler(repo).Handle(
			context.Background(), stockmovement.GetTopMoversQuery{UserId: userID, Limit: 10, DateFilter: &filter},
		)

		require.NoError(t, err)
		repo.AssertNotCalled(t, "GetAllStockMovements", mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})
}
