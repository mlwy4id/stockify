package valueobject_test

import (
	"testing"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

func Test_NewEmail_InputValidation(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		want    string
		wantErr bool
	}{
		{name: "accepts valid email", input: "user@example.com", want: "user@example.com"},
		{name: "accepts plus and dots", input: "first.last+tag@sub.example.co", want: "first.last+tag@sub.example.co"},
		{name: "trims whitespace", input: "  user@example.com  ", want: "user@example.com"},
		{name: "rejects empty", input: "", wantErr: true},
		{name: "rejects whitespace only", input: "   ", wantErr: true},
		{name: "rejects missing at sign", input: "userexample.com", wantErr: true},
		{name: "rejects missing domain", input: "user@", wantErr: true},
		{name: "rejects missing local part", input: "@example.com", wantErr: true},
		{name: "rejects short tld", input: "user@example.c", wantErr: true},
		{name: "rejects spaces", input: "user @example.com", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			email, err := vo.NewEmail(tt.input)

			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if email.Value() != tt.want {
				t.Errorf("value = %q, want %q", email.Value(), tt.want)
			}
		})
	}
}

func Test_ReconstructEmail_Rehydration_Restored(t *testing.T) {
	if got := vo.ReconstructEmail("any@value").Value(); got != "any@value" {
		t.Errorf("value = %q, want %q", got, "any@value")
	}
}
