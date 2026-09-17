package entity_test

import (
	"testing"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

func Test_NewStockMovement_InputValidation(t *testing.T) {
	date := time.Date(2026, time.September, 15, 10, 30, 0, 0, time.UTC)

	tests := []struct {
		name       string
		action     enum.Action
		source     string
		reason     string
		wantErr    bool
		wantSource bool
		wantReason bool
	}{
		{name: "creates valid movement", action: enum.Sold, source: "Tokopedia", reason: "online order", wantSource: true, wantReason: true},
		{name: "trims source and reason", action: enum.Restock, source: "  Supplier  ", reason: "  restock  ", wantSource: true, wantReason: true},
		{name: "rejects invalid action", action: enum.Action("NOPE"), wantErr: true},
		{name: "treats blank source and reason as nil", action: enum.Broken, source: "   ", reason: "", wantSource: false, wantReason: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			sm, err := entity.NewStockMovement(
				mustUserId(t),
				vo.NewProductId(),
				tt.action,
				mustQuantity(t, 2),
				mustQuantity(t, 8),
				tt.source,
				tt.reason,
				date,
			)

			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if sm.Id().Value() == "" {
				t.Error("expected generated stock movement id, got empty")
			}
			if sm.Action() != tt.action {
				t.Errorf("action = %s, want %s", sm.Action(), tt.action)
			}
			if sm.Quantity().Value() != 2 {
				t.Errorf("quantity = %d, want 2", sm.Quantity().Value())
			}
			if sm.ProductBalance().Value() != 8 {
				t.Errorf("balance = %d, want 8", sm.ProductBalance().Value())
			}
			if !sm.Date().Equal(date) {
				t.Errorf("date = %v, want %v", sm.Date(), date)
			}
			if got := sm.Source() != nil; got != tt.wantSource {
				t.Errorf("source present = %v, want %v", got, tt.wantSource)
			}
			if got := sm.Reason() != nil; got != tt.wantReason {
				t.Errorf("reason present = %v, want %v", got, tt.wantReason)
			}
		})
	}
}

func Test_ReconstructStockMovement_Rehydration_Restored(t *testing.T) {
	id := vo.NewStockMovementId()
	userId := mustUserId(t)
	productId := vo.NewProductId()
	date := time.Date(2026, time.September, 15, 0, 0, 0, 0, time.UTC)

	sm := entity.ReconstructStockMovement(id, userId, productId, string(enum.Restock), 4, 12, nil, nil, date)

	if sm.Id().Value() != id.Value() {
		t.Errorf("id = %q, want %q", sm.Id().Value(), id.Value())
	}
	if sm.ProductId().Value() != productId.Value() {
		t.Errorf("productId = %q, want %q", sm.ProductId().Value(), productId.Value())
	}
	if sm.Action() != enum.Restock {
		t.Errorf("action = %s, want %s", sm.Action(), enum.Restock)
	}
	if sm.Quantity().Value() != 4 {
		t.Errorf("quantity = %d, want 4", sm.Quantity().Value())
	}
	if sm.ProductBalance().Value() != 12 {
		t.Errorf("balance = %d, want 12", sm.ProductBalance().Value())
	}
}

func Test_StockMovement_UserId_MatchesOwner(t *testing.T) {
	userId := mustUserId(t)
	sm := entity.ReconstructStockMovement(
		vo.NewStockMovementId(), userId, vo.NewProductId(), string(enum.Sold), 2, 8, nil, nil, time.Now(),
	)

	if sm.UserId().Value() != userId.Value() {
		t.Errorf("userId = %q, want %q", sm.UserId().Value(), userId.Value())
	}
}
