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

func Test_GetStockMovementByProductIDQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	t.Run("returns an empty list on repository error", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(nil, boom)

		dtos, err := stockmovement.NewGetStockMovementByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockMovementByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.ErrorIs(t, err, boom)
		assert.Empty(t, dtos)
		assert.NotNil(t, dtos)
		repo.AssertExpectations(t)
	})

	t.Run("maps movements without a date range", func(t *testing.T) {
		date := time.Now().Add(-2 * time.Hour)
		movements := pointerMovements(
			fakes.MustStockMovementWithNote(t, userID, productID, enum.Sold, 3, 7, "Tokopedia", "online order", date),
		)

		repo := new(fakes.MockProductRepository)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(movements, nil)

		dtos, err := stockmovement.NewGetStockMovementByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockMovementByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		require.Len(t, dtos, 1)
		assert.Equal(t, movements[0].Id().Value(), dtos[0].ID)
		assert.Equal(t, productID.Value(), dtos[0].ProductId)
		assert.Equal(t, "SOLD", dtos[0].Action)
		assert.Equal(t, 3, dtos[0].Quantity)
		assert.Equal(t, "Tokopedia", dtos[0].Source)
		assert.Equal(t, "online order", dtos[0].Reason)
		assert.True(t, dtos[0].Date.Equal(date))
		assert.Empty(t, dtos[0].ProductName)
		repo.AssertExpectations(t)
	})

	t.Run("leaves source and reason empty when absent", func(t *testing.T) {
		movements := pointerMovements(
			newMovement(t, userID, productID, enum.Restock, 5, 15, time.Now().Add(-time.Hour)),
		)

		repo := new(fakes.MockProductRepository)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(movements, nil)

		dtos, err := stockmovement.NewGetStockMovementByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockMovementByProductIDQuery{UserId: userID, ProductId: productID},
		)

		require.NoError(t, err)
		require.Len(t, dtos, 1)
		assert.Empty(t, dtos[0].Source)
		assert.Empty(t, dtos[0].Reason)
	})

	t.Run("uses the date range when both bounds are given", func(t *testing.T) {
		start := time.Now().AddDate(0, 0, -7)
		end := time.Now()

		repo := new(fakes.MockProductRepository)
		repo.On("GetStockMovementsByProductIDAndDateRange", mock.Anything, userID, productID, start, end).
			Return(pointerMovements(), nil)

		_, err := stockmovement.NewGetStockMovementByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockMovementByProductIDQuery{UserId: userID, ProductId: productID, Start: &start, End: &end},
		)

		require.NoError(t, err)
		repo.AssertNotCalled(t, "GetStockMovementsByProductID",
			mock.Anything, mock.Anything, mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})

	t.Run("ignores a one sided date range", func(t *testing.T) {
		start := time.Now().AddDate(0, 0, -7)

		repo := new(fakes.MockProductRepository)
		repo.On("GetStockMovementsByProductID", mock.Anything, userID, productID, false).Return(pointerMovements(), nil)

		_, err := stockmovement.NewGetStockMovementByProductIDHandler(repo).Handle(
			context.Background(),
			stockmovement.GetStockMovementByProductIDQuery{UserId: userID, ProductId: productID, Start: &start},
		)

		require.NoError(t, err)
		repo.AssertNotCalled(t, "GetStockMovementsByProductIDAndDateRange",
			mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})
}

func Test_GetAllStockMovementsQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	t.Run("returns an empty list on repository error", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsWithProduct", mock.Anything, userID).Return(nil, boom)

		dtos, err := stockmovement.NewGetAllStockMovementsHandler(repo).Handle(
			context.Background(), stockmovement.GetAllStockMovementsQuery{UserId: userID},
		)

		require.ErrorIs(t, err, boom)
		assert.Empty(t, dtos)
		assert.NotNil(t, dtos)
		repo.AssertExpectations(t)
	})

	t.Run("maps movements including the product name", func(t *testing.T) {
		movement := fakes.MustStockMovementWithNote(t, userID, productID, enum.Broken, 2, 8, "Gudang", "rusak", time.Now())
		withProduct := fakes.MustStockMovementWithProduct(t, movement, "Kopi Susu")
		movements := []*entity.StockMovementWithProduct{&withProduct}

		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsWithProduct", mock.Anything, userID).Return(movements, nil)

		dtos, err := stockmovement.NewGetAllStockMovementsHandler(repo).Handle(
			context.Background(), stockmovement.GetAllStockMovementsQuery{UserId: userID},
		)

		require.NoError(t, err)
		require.Len(t, dtos, 1)
		assert.Equal(t, "Kopi Susu", dtos[0].ProductName)
		assert.Equal(t, productID.Value(), dtos[0].ProductId)
		assert.Equal(t, "BROKEN", dtos[0].Action)
		assert.Equal(t, 2, dtos[0].Quantity)
		assert.Equal(t, "Gudang", dtos[0].Source)
		assert.Equal(t, "rusak", dtos[0].Reason)
		repo.AssertExpectations(t)
	})

	t.Run("uses the date range when both bounds are given", func(t *testing.T) {
		start := time.Now().AddDate(0, 0, -30)
		end := time.Now()

		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsAndDateRangeWithProduct", mock.Anything, userID, start, end).
			Return([]*entity.StockMovementWithProduct{}, nil)

		_, err := stockmovement.NewGetAllStockMovementsHandler(repo).Handle(
			context.Background(), stockmovement.GetAllStockMovementsQuery{UserId: userID, Start: &start, End: &end},
		)

		require.NoError(t, err)
		repo.AssertNotCalled(t, "GetAllStockMovementsWithProduct", mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})

	t.Run("ignores a one sided date range", func(t *testing.T) {
		end := time.Now()

		repo := new(fakes.MockProductRepository)
		repo.On("GetAllStockMovementsWithProduct", mock.Anything, userID).Return([]*entity.StockMovementWithProduct{}, nil)

		dtos, err := stockmovement.NewGetAllStockMovementsHandler(repo).Handle(
			context.Background(), stockmovement.GetAllStockMovementsQuery{UserId: userID, End: &end},
		)

		require.NoError(t, err)
		assert.Empty(t, dtos)
		repo.AssertNotCalled(t, "GetAllStockMovementsAndDateRangeWithProduct",
			mock.Anything, mock.Anything, mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})
}
