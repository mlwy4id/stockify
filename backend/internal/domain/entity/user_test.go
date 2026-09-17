package entity_test

import (
	"testing"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

func Test_NewUser_InputValidation(t *testing.T) {
	tests := []struct {
		name         string
		userName     string
		passwordHash string
		wantName     string
		wantErr      bool
	}{
		{name: "creates user", userName: "Budi", passwordHash: "hashed", wantName: "Budi"},
		{name: "trims name", userName: "  Budi  ", passwordHash: "hashed", wantName: "Budi"},
		{name: "rejects empty name", userName: "", passwordHash: "hashed", wantErr: true},
		{name: "rejects whitespace only name", userName: "   ", passwordHash: "hashed", wantErr: true},
		{name: "rejects empty password hash", userName: "Budi", passwordHash: "", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			user, err := entity.NewUser(mustEmail(t, "budi@example.com"), tt.userName, tt.passwordHash)

			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if user.Name() != tt.wantName {
				t.Errorf("name = %q, want %q", user.Name(), tt.wantName)
			}
			if user.Id().Value() == "" {
				t.Error("expected generated user id, got empty")
			}
			if user.Email().Value() != "budi@example.com" {
				t.Errorf("email = %q, want %q", user.Email().Value(), "budi@example.com")
			}
			if user.PasswordHash() != tt.passwordHash {
				t.Errorf("passwordHash = %q, want %q", user.PasswordHash(), tt.passwordHash)
			}
			if user.CreatedAt().IsZero() || user.UpdatedAt().IsZero() {
				t.Error("expected timestamps to be set")
			}
		})
	}
}

func Test_ReconstructUser_Rehydration_Restored(t *testing.T) {
	id := vo.NewUserId()
	email := mustEmail(t, "budi@example.com")
	createdAt := time.Date(2026, time.September, 1, 0, 0, 0, 0, time.UTC)
	updatedAt := time.Date(2026, time.September, 2, 0, 0, 0, 0, time.UTC)

	user := entity.ReconstructUser(id, email, "Budi", "hashed", createdAt, updatedAt)

	if user.Id().Value() != id.Value() {
		t.Errorf("id = %q, want %q", user.Id().Value(), id.Value())
	}
	if user.Email().Value() != email.Value() {
		t.Errorf("email = %q, want %q", user.Email().Value(), email.Value())
	}
	if !user.CreatedAt().Equal(createdAt) {
		t.Errorf("createdAt = %v, want %v", user.CreatedAt(), createdAt)
	}
	if !user.UpdatedAt().Equal(updatedAt) {
		t.Errorf("updatedAt = %v, want %v", user.UpdatedAt(), updatedAt)
	}
}
