package category_test

import (
	"context"
	"errors"
	"testing"

	command "github.com/mlwy4id/stockify/internal/application/command/category"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_CreateCategoryCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	boom := errors.New("boom")

	t.Run("saves the category and returns its id", func(t *testing.T) {
		repo := new(fakes.MockCategoryRepository)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(c *entity.Category) bool {
			return c.Name() == "Minuman" && c.UserId().Value() == userID.Value()
		})).Return(nil)

		id, err := command.NewCreateCategoryCommandHandler(repo).Handle(context.Background(), command.CreateCategoryCommand{
			UserId: userID,
			Name:   "  Minuman  ",
		})

		require.NoError(t, err)
		assert.NotEmpty(t, id)
		repo.AssertExpectations(t)
	})

	t.Run("rejects a blank name without saving", func(t *testing.T) {
		repo := new(fakes.MockCategoryRepository)

		_, err := command.NewCreateCategoryCommandHandler(repo).Handle(context.Background(), command.CreateCategoryCommand{
			UserId: userID,
			Name:   "   ",
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		repo := new(fakes.MockCategoryRepository)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		_, err := command.NewCreateCategoryCommandHandler(repo).Handle(context.Background(), command.CreateCategoryCommand{
			UserId: userID,
			Name:   "Minuman",
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

func Test_RenameCategoryCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("renames the category and returns its id", func(t *testing.T) {
		category := fakes.MustCategory(t, userID, "Minuman")

		repo := new(fakes.MockCategoryRepository)
		repo.On("FindByID", mock.Anything, userID, categoryID).Return(&category, nil)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(c *entity.Category) bool {
			return c.Name() == "Makanan"
		})).Return(nil)

		id, err := command.NewRenameCategoryCommandHandler(repo).Handle(context.Background(), command.RenameCategoryCommand{
			UserId: userID,
			Id:     categoryID,
			Name:   "  Makanan  ",
		})

		require.NoError(t, err)
		assert.Equal(t, category.Id().Value(), id)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the lookup error", func(t *testing.T) {
		repo := new(fakes.MockCategoryRepository)
		repo.On("FindByID", mock.Anything, userID, categoryID).Return(nil, boom)

		_, err := command.NewRenameCategoryCommandHandler(repo).Handle(context.Background(), command.RenameCategoryCommand{
			UserId: userID,
			Id:     categoryID,
			Name:   "Makanan",
		})

		require.ErrorIs(t, err, boom)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects a blank name without saving", func(t *testing.T) {
		category := fakes.MustCategory(t, userID, "Minuman")

		repo := new(fakes.MockCategoryRepository)
		repo.On("FindByID", mock.Anything, userID, categoryID).Return(&category, nil)

		_, err := command.NewRenameCategoryCommandHandler(repo).Handle(context.Background(), command.RenameCategoryCommand{
			UserId: userID,
			Id:     categoryID,
			Name:   "   ",
		})

		require.Error(t, err)
		assert.Equal(t, "Minuman", category.Name(), "the name must stay untouched on error")
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		category := fakes.MustCategory(t, userID, "Minuman")

		repo := new(fakes.MockCategoryRepository)
		repo.On("FindByID", mock.Anything, userID, categoryID).Return(&category, nil)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		_, err := command.NewRenameCategoryCommandHandler(repo).Handle(context.Background(), command.RenameCategoryCommand{
			UserId: userID,
			Id:     categoryID,
			Name:   "Makanan",
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})
}

func Test_DeleteCategoryCommand_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("delegates the cascade delete to the domain service", func(t *testing.T) {
		deletion := new(fakes.MockCategoryDeletionService)
		deletion.On("DeleteCategoryWithCascade", mock.Anything, userID, categoryID).Return(nil)

		err := command.NewDeleteCategoryCommandHandler(deletion).Handle(context.Background(), command.DeleteCategoryCommand{
			UserId: userID,
			Id:     categoryID,
		})

		require.NoError(t, err)
		deletion.AssertExpectations(t)
	})

	t.Run("propagates the deletion error", func(t *testing.T) {
		deletion := new(fakes.MockCategoryDeletionService)
		deletion.On("DeleteCategoryWithCascade", mock.Anything, userID, categoryID).Return(boom)

		err := command.NewDeleteCategoryCommandHandler(deletion).Handle(context.Background(), command.DeleteCategoryCommand{
			UserId: userID,
			Id:     categoryID,
		})

		require.ErrorIs(t, err, boom)
		deletion.AssertExpectations(t)
	})
}
