package stockmovement_test

import (
	"context"
	"errors"
	"testing"
	"time"

	command "github.com/mlwy4id/stockify/internal/application/command/stock_movement"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_CreateStockMovementCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")
	date := time.Now().Add(-time.Hour)

	t.Run("restock increases stock and saves the pending movement", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.Quantity().Value() == 16 && len(p.PendingStockMovements()) == 1
		})).Return(nil)

		err := command.NewCreateStockMovementCommandHandler(repo).Handle(context.Background(), command.CreateStockMovementCommand{
			UserId:    userID,
			ProductId: productID,
			Action:    enum.Restock,
			Quantity:  mocks.MustQuantity(t, 6),
			Source:    "Supplier",
			Date:      date,
		})

		require.NoError(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("a sale decreases stock", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.Quantity().Value() == 6
		})).Return(nil)

		err := command.NewCreateStockMovementCommandHandler(repo).Handle(context.Background(), command.CreateStockMovementCommand{
			UserId:    userID,
			ProductId: productID,
			Action:    enum.Sold,
			Quantity:  mocks.MustQuantity(t, 4),
			Date:      date,
		})

		require.NoError(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("rejects a sale beyond the available stock", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 2, 3, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)

		err := command.NewCreateStockMovementCommandHandler(repo).Handle(context.Background(), command.CreateStockMovementCommand{
			UserId:    userID,
			ProductId: productID,
			Action:    enum.Sold,
			Quantity:  mocks.MustQuantity(t, 3),
			Date:      date,
		})

		require.Error(t, err)
		assert.Equal(t, 2, product.Quantity().Value(), "stock must stay untouched on error")
		assert.Empty(t, product.PendingStockMovements())
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects an invalid action", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)

		err := command.NewCreateStockMovementCommandHandler(repo).Handle(context.Background(), command.CreateStockMovementCommand{
			UserId:    userID,
			ProductId: productID,
			Action:    enum.Action("NOPE"),
			Quantity:  mocks.MustQuantity(t, 1),
			Date:      date,
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the lookup error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(nil, boom)

		err := command.NewCreateStockMovementCommandHandler(repo).Handle(context.Background(), command.CreateStockMovementCommand{
			UserId:    userID,
			ProductId: productID,
			Action:    enum.Restock,
			Quantity:  mocks.MustQuantity(t, 1),
			Date:      date,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		product := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		err := command.NewCreateStockMovementCommandHandler(repo).Handle(context.Background(), command.CreateStockMovementCommand{
			UserId:    userID,
			ProductId: productID,
			Action:    enum.Restock,
			Quantity:  mocks.MustQuantity(t, 1),
			Date:      date,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}
