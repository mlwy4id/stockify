package product_test

import (
	"context"
	"errors"
	"testing"

	command "github.com/mlwy4id/stockify/internal/application/command/product"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_CreateProductCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("saves the product and returns its id", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.Name() == "Kopi Susu" &&
				p.Quantity().Value() == 10 &&
				p.StockThreshold().Value() == 3 &&
				p.UserId().Value() == userID.Value()
		})).Return(nil)

		id, err := command.NewCreateProductCommandHandler(repo).Handle(context.Background(), command.CreateProductCommand{
			UserId:         userID,
			Name:           "  Kopi Susu  ",
			Quantity:       fakes.MustQuantity(t, 10),
			StockThreshold: fakes.MustThreshold(t, 3),
		})

		require.NoError(t, err)
		assert.NotEmpty(t, id)
		repo.AssertExpectations(t)
	})

	t.Run("forwards the image url and category id", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(p *entity.Product) bool {
			return p.ImageUrl() == "https://img" &&
				p.CategoryId() != nil && p.CategoryId().Value() == categoryID.Value()
		})).Return(nil)

		_, err := command.NewCreateProductCommandHandler(repo).Handle(context.Background(), command.CreateProductCommand{
			UserId:         userID,
			Name:           "Kopi",
			ImageUrl:       "https://img",
			Quantity:       fakes.MustQuantity(t, 10),
			StockThreshold: fakes.MustThreshold(t, 3),
			CategoryId:     &categoryID,
		})

		require.NoError(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("rejects an empty name without saving", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)

		_, err := command.NewCreateProductCommandHandler(repo).Handle(context.Background(), command.CreateProductCommand{
			UserId:         userID,
			Name:           "   ",
			Quantity:       fakes.MustQuantity(t, 10),
			StockThreshold: fakes.MustThreshold(t, 3),
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		repo := new(fakes.MockProductRepository)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		_, err := command.NewCreateProductCommandHandler(repo).Handle(context.Background(), command.CreateProductCommand{
			UserId:         userID,
			Name:           "Kopi",
			Quantity:       fakes.MustQuantity(t, 10),
			StockThreshold: fakes.MustThreshold(t, 3),
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}
