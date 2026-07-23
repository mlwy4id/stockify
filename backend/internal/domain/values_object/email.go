package valueobject

import (
	"errors"
	"regexp"
	"strings"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

type Email struct {
	value string
}

func NewEmail(value string) (Email, error) {
	trimmed := strings.TrimSpace(value)

	if trimmed == "" {
		return Email{}, errors.New("email must not be empty")
	}

	if !emailRegex.MatchString(trimmed) {
		return Email{}, errors.New("invalid email format")
	}

	return Email{value: trimmed}, nil
}

func (e Email) Value() string {
	return e.value
}

func ReconstructEmail(value string) Email {
	return Email{value: value}
}
