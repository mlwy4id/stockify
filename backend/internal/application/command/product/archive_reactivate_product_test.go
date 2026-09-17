package product_test

import (
	"context"
	"errors"
	"testing"

	command "github.com/mlwy4id/stockify/internal/application/command/product"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_ArchiveProductCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	t.Run("archives the product", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.ArchivedAt() != nil
		})).Return(nil)

		err := command.NewArchiveProductCommandHandler(repo).Handle(context.Background(), command.ArchiveProductCommand{
			UserId: userID, Id: productID,
		})

		require.NoError(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the lookup error", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(nil, boom)

		err := command.NewArchiveProductCommandHandler(repo).Handle(context.Background(), command.ArchiveProductCommand{
			UserId: userID, Id: productID,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects archiving twice without saving", func(t *testing.T) {
		archived := fakes.MustArchivedProduct(t, userID, "Kopi", 10, 3)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&archived, nil)

		err := command.NewArchiveProductCommandHandler(repo).Handle(context.Background(), command.ArchiveProductCommand{
			UserId: userID, Id: productID,
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		product := fakes.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&product, nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		err := command.NewArchiveProductCommandHandler(repo).Handle(context.Background(), command.ArchiveProductCommand{
			UserId: userID, Id: productID,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

func Test_ReactivateProductCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	t.Run("reactivates the product", func(t *testing.T) {
		archived := fakes.MustArchivedProduct(t, userID, "Kopi", 10, 3)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&archived, nil)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.ArchivedAt() == nil
		})).Return(nil)

		err := command.NewReactivateProductCommandHandler(repo).Handle(context.Background(), command.ReactivateProductCommand{
			UserId: userID, Id: productID,
		})

		require.NoError(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the lookup error", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(nil, boom)

		err := command.NewReactivateProductCommandHandler(repo).Handle(context.Background(), command.ReactivateProductCommand{
			UserId: userID, Id: productID,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects reactivating an active product without saving", func(t *testing.T) {
		active := fakes.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&active, nil)

		err := command.NewReactivateProductCommandHandler(repo).Handle(context.Background(), command.ReactivateProductCommand{
			UserId: userID, Id: productID,
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		archived := fakes.MustArchivedProduct(t, userID, "Kopi", 10, 3)

		repo := new(fakes.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&archived, nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		err := command.NewReactivateProductCommandHandler(repo).Handle(context.Background(), command.ReactivateProductCommand{
			UserId: userID, Id: productID,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}
