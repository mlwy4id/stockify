package entity_test

import (
	"testing"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

func Test_NewProduct_InputValidation(t *testing.T) {
	tests := []struct {
		name        string
		productName string
		wantName    string
		wantErr     bool
	}{
		{name: "creates product with given fields", productName: "Kopi Susu", wantName: "Kopi Susu"},
		{name: "trims surrounding whitespace", productName: "  Kopi Susu  ", wantName: "Kopi Susu"},
		{name: "rejects empty name", productName: "", wantErr: true},
		{name: "rejects whitespace only name", productName: "   ", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			product, err := entity.NewProduct(mustUserId(t), tt.productName, "https://img", mustQuantity(t, 10), mustStockThreshold(t, 3), nil)

			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if product.Name() != tt.wantName {
				t.Errorf("name = %q, want %q", product.Name(), tt.wantName)
			}
			if product.Id().Value() == "" {
				t.Error("expected generated product id, got empty")
			}
			if product.Quantity().Value() != 10 {
				t.Errorf("quantity = %d, want 10", product.Quantity().Value())
			}
			if product.ArchivedAt() != nil {
				t.Error("expected new product to be active")
			}
			if len(product.PendingStockMovements()) != 0 {
				t.Error("expected no pending stock movements")
			}
		})
	}
}

func Test_Product_AddStockMovement_BalanceAndHistoryUpdated(t *testing.T) {
	date := time.Date(2026, time.September, 15, 10, 30, 0, 0, time.UTC)

	tests := []struct {
		name         string
		initial      int
		action       enum.Action
		amount       int
		wantQuantity int
		wantErr      bool
	}{
		{name: "restock increases quantity", initial: 10, action: enum.Restock, amount: 5, wantQuantity: 15},
		{name: "refund increases quantity", initial: 10, action: enum.Refund, amount: 2, wantQuantity: 12},
		{name: "sold decreases quantity", initial: 10, action: enum.Sold, amount: 4, wantQuantity: 6},
		{name: "broken decreases quantity", initial: 10, action: enum.Broken, amount: 3, wantQuantity: 7},
		{name: "sold more than balance fails", initial: 2, action: enum.Sold, amount: 3, wantErr: true},
		{name: "invalid action fails", initial: 10, action: enum.Action("UNKNOWN"), amount: 1, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			product := mustProduct(t, tt.initial)

			err := product.AddStockMovement(tt.action, mustQuantity(t, tt.amount), "marketplace", "daily sales", date)

			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				if product.Quantity().Value() != tt.initial {
					t.Errorf("quantity changed on error: got %d, want %d", product.Quantity().Value(), tt.initial)
				}
				if len(product.PendingStockMovements()) != 0 {
					t.Error("expected no pending movement on error")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if product.Quantity().Value() != tt.wantQuantity {
				t.Errorf("quantity = %d, want %d", product.Quantity().Value(), tt.wantQuantity)
			}

			pending := product.PendingStockMovements()
			if len(pending) != 1 {
				t.Fatalf("pending movements = %d, want 1", len(pending))
			}
			if pending[0].ProductBalance().Value() != tt.wantQuantity {
				t.Errorf("movement balance = %d, want %d", pending[0].ProductBalance().Value(), tt.wantQuantity)
			}
			if pending[0].Action() != tt.action {
				t.Errorf("movement action = %s, want %s", pending[0].Action(), tt.action)
			}
		})
	}
}

func Test_Product_Archive_ProductMarkedArchived(t *testing.T) {
	product := mustProduct(t, 10)

	if err := product.ArchiveProduct(); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if product.ArchivedAt() == nil {
		t.Fatal("expected archivedAt to be set")
	}
	if err := product.ArchiveProduct(); err == nil {
		t.Fatal("expected error archiving an already archived product")
	}
}

func Test_Product_Reactivate_ProductMarkedActive(t *testing.T) {
	product := mustProduct(t, 10)

	if err := product.ReactivateProduct(); err == nil {
		t.Fatal("expected error reactivating an active product")
	}

	if err := product.ArchiveProduct(); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if err := product.ReactivateProduct(); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if product.ArchivedAt() != nil {
		t.Fatal("expected archivedAt to be cleared")
	}
}

func Test_Product_Update_FieldsApplied(t *testing.T) {
	t.Run("updates provided fields", func(t *testing.T) {
		product := mustProduct(t, 10)
		newName := "  Kopi Baru  "
		threshold := mustStockThreshold(t, 9)
		image := "https://img/new.png"

		if err := product.UpdateProduct(&newName, &threshold, nil, &image); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if product.Name() != "Kopi Baru" {
			t.Errorf("name = %q, want %q", product.Name(), "Kopi Baru")
		}
		if product.StockThreshold().Value() != 9 {
			t.Errorf("threshold = %d, want 9", product.StockThreshold().Value())
		}
		if product.ImageUrl() != image {
			t.Errorf("imageUrl = %q, want %q", product.ImageUrl(), image)
		}
	})

	t.Run("rejects empty name", func(t *testing.T) {
		product := mustProduct(t, 10)
		empty := "   "

		if err := product.UpdateProduct(&empty, nil, nil, nil); err == nil {
			t.Fatal("expected error for empty name")
		}
	})

	t.Run("rejects no fields", func(t *testing.T) {
		product := mustProduct(t, 10)

		if err := product.UpdateProduct(nil, nil, nil, nil); err == nil {
			t.Fatal("expected error when nothing to update")
		}
	})

	t.Run("rejects archived product", func(t *testing.T) {
		product := mustProduct(t, 10)
		if err := product.ArchiveProduct(); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		name := "Baru"

		if err := product.UpdateProduct(&name, nil, nil, nil); err == nil {
			t.Fatal("expected error updating an archived product")
		}
	})

	t.Run("updates category id", func(t *testing.T) {
		product := mustProduct(t, 10)
		categoryId := mustCategoryId(t)

		if err := product.UpdateProduct(nil, nil, &categoryId, nil); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if product.CategoryId() == nil {
			t.Fatal("expected category id to be set")
		}
		if product.CategoryId().Value() != categoryId.Value() {
			t.Errorf("categoryId = %q, want %q", product.CategoryId().Value(), categoryId.Value())
		}
	})

	t.Run("changes only the provided field", func(t *testing.T) {
		product := mustProduct(t, 10)
		threshold := mustStockThreshold(t, 2)

		if err := product.UpdateProduct(nil, &threshold, nil, nil); err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if product.Name() != "Kopi Susu" {
			t.Errorf("name = %q, want unchanged %q", product.Name(), "Kopi Susu")
		}
		if product.ImageUrl() != "" {
			t.Errorf("imageUrl = %q, want unchanged empty", product.ImageUrl())
		}
	})
}

func Test_Product_CategoryIdAndMovements_AssignedCorrectly(t *testing.T) {
	userId := mustUserId(t)
	categoryId := mustCategoryId(t)
	productId := vo.NewProductId()
	date := time.Date(2026, time.September, 15, 10, 0, 0, 0, time.UTC)

	persisted := entity.ReconstructStockMovement(vo.NewStockMovementId(), userId, productId, string(enum.Restock), 5, 15, nil, nil, date)

	product := entity.ReconstructProduct(
		productId, userId, "Kopi", "img", mustQuantity(t, 15), mustStockThreshold(t, 5), &categoryId, []entity.StockMovement{persisted}, nil,
	)

	if product.CategoryId() == nil {
		t.Fatal("expected category id to be preserved")
	}
	if product.CategoryId().Value() != categoryId.Value() {
		t.Errorf("categoryId = %q, want %q", product.CategoryId().Value(), categoryId.Value())
	}
	if got := len(product.StockMovements()); got != 1 {
		t.Fatalf("stock movements = %d, want 1", got)
	}

	if err := product.AddStockMovement(enum.Sold, mustQuantity(t, 2), "", "", date); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	all := product.StockMovements()
	if len(all) != 2 {
		t.Fatalf("stock movements = %d, want 2 (persisted + pending)", len(all))
	}
	if all[0].Action() != enum.Restock {
		t.Errorf("first movement action = %s, want %s", all[0].Action(), enum.Restock)
	}
	if all[1].Action() != enum.Sold {
		t.Errorf("second movement action = %s, want %s", all[1].Action(), enum.Sold)
	}

	if product.CategoryId() == nil {
		t.Fatal("expected category id to survive a stock movement")
	}
}

func Test_Product_CategoryId_UnassignedCategory_IsNil(t *testing.T) {
	product := mustProduct(t, 5)

	if product.CategoryId() != nil {
		t.Errorf("categoryId = %v, want nil", product.CategoryId())
	}
}

func Test_Product_ClearPendingMovements_ListEmptied(t *testing.T) {
	product := mustProduct(t, 10)
	if err := product.AddStockMovement(enum.Restock, mustQuantity(t, 5), "", "", time.Now()); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(product.PendingStockMovements()) != 1 {
		t.Fatalf("pending movements = %d, want 1", len(product.PendingStockMovements()))
	}

	product.ClearPendingStockMovements()

	if len(product.PendingStockMovements()) != 0 {
		t.Errorf("pending movements = %d, want 0", len(product.PendingStockMovements()))
	}
}

func Test_ReconstructProduct_Rehydration_Restored(t *testing.T) {
	id := vo.NewProductId()
	userId := vo.NewUserId()
	archivedAt := time.Date(2026, time.September, 1, 0, 0, 0, 0, time.UTC)

	product := entity.ReconstructProduct(id, userId, "Kopi", "img", mustQuantity(t, 3), mustStockThreshold(t, 1), nil, nil, &archivedAt)

	if product.Id().Value() != id.Value() {
		t.Errorf("id = %q, want %q", product.Id().Value(), id.Value())
	}
	if product.UserId().Value() != userId.Value() {
		t.Errorf("userId = %q, want %q", product.UserId().Value(), userId.Value())
	}
	if product.ArchivedAt() == nil {
		t.Fatal("expected archivedAt to be preserved")
	}
	if len(product.PendingStockMovements()) != 0 {
		t.Error("expected no pending movements after reconstruction")
	}
}
