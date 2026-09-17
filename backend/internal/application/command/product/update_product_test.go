package product_test

import (
	"context"
	"errors"
	"testing"

	command "github.com/mlwy4id/stockify/internal/application/command/product"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_UpdateProductCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	productID := vo.NewProductId()
	boom := errors.New("boom")

	newProduct := func() *entity.Product {
		p := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)
		return &p
	}

	t.Run("applies the changes and returns the product id", func(t *testing.T) {
		product := newProduct()
		name := "Teh"

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(product, nil)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.Name() == "Teh" && p.StockThreshold().Value() == 9
		})).Return(nil)

		id, err := command.NewUpdateProductCommandHandler(repo).Handle(context.Background(), command.UpdateProductCommand{
			UserId:         userID,
			Id:             productID,
			Name:           &name,
			StockThreshold: mocks.Ptr(mocks.MustThreshold(t, 9)),
		})

		require.NoError(t, err)
		assert.Equal(t, product.Id().Value(), id)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the lookup error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(nil, boom)

		name := "Teh"
		_, err := command.NewUpdateProductCommandHandler(repo).Handle(context.Background(), command.UpdateProductCommand{
			UserId: userID, Id: productID, Name: &name,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects an update without fields and does not save", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(newProduct(), nil)

		_, err := command.NewUpdateProductCommandHandler(repo).Handle(context.Background(), command.UpdateProductCommand{
			UserId: userID, Id: productID,
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects updating an archived product and does not save", func(t *testing.T) {
		archived := mocks.MustArchivedProduct(t, userID, "Kopi", 10, 3)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(&archived, nil)

		name := "Teh"
		_, err := command.NewUpdateProductCommandHandler(repo).Handle(context.Background(), command.UpdateProductCommand{
			UserId: userID, Id: productID, Name: &name,
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindByID", mock.Anything, userID, productID).Return(newProduct(), nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		name := "Teh"
		_, err := command.NewUpdateProductCommandHandler(repo).Handle(context.Background(), command.UpdateProductCommand{
			UserId: userID, Id: productID, Name: &name,
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}
