package entity_test

import (
	"testing"

	"github.com/mlwy4id/stockify/internal/domain/entity"
)

func Test_NewCategory_InputValidation(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		wantName string
		wantErr  bool
	}{
		{name: "creates category", input: "Minuman", wantName: "Minuman"},
		{name: "trims whitespace", input: "  Minuman  ", wantName: "Minuman"},
		{name: "rejects empty", input: "", wantErr: true},
		{name: "rejects whitespace only", input: "   ", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, err := entity.NewCategory(mustUserId(t), tt.input)

			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if category.Name() != tt.wantName {
				t.Errorf("name = %q, want %q", category.Name(), tt.wantName)
			}
			if category.Id().Value() == "" {
				t.Error("expected generated category id, got empty")
			}
			if category.IsDeleted() {
				t.Error("expected new category to not be deleted")
			}
		})
	}
}

func Test_Category_Rename_FieldsApplied(t *testing.T) {
	category, err := entity.NewCategory(mustUserId(t), "Minuman")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if err := category.RenameCategory("  Makanan  "); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if category.Name() != "Makanan" {
		t.Errorf("name = %q, want %q", category.Name(), "Makanan")
	}

	if err := category.RenameCategory("   "); err == nil {
		t.Fatal("expected error renaming to a blank name")
	}
	if category.Name() != "Makanan" {
		t.Errorf("name changed on error: got %q, want %q", category.Name(), "Makanan")
	}
}

func Test_Category_Delete_NoError(t *testing.T) {
	category, err := entity.NewCategory(mustUserId(t), "Minuman")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if err := category.DeleteCategory(); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !category.IsDeleted() {
		t.Error("expected category to be marked deleted")
	}
	if category.DeletedAt() == nil {
		t.Error("expected deletedAt to be set")
	}

	if err := category.DeleteCategory(); err == nil {
		t.Fatal("expected error deleting an already deleted category")
	}
}

func Test_ReconstructCategory_Rehydration_Restored(t *testing.T) {
	id := mustCategoryId(t)
	userId := mustUserId(t)

	category := entity.ReconstructCategory(id, userId, "Minuman", true, nil)

	if category.Id().Value() != id.Value() {
		t.Errorf("id = %q, want %q", category.Id().Value(), id.Value())
	}
	if category.UserId().Value() != userId.Value() {
		t.Errorf("userId = %q, want %q", category.UserId().Value(), userId.Value())
	}
	if !category.IsDeleted() {
		t.Error("expected reconstructed category to preserve deleted flag")
	}
}
