package valueobject

import "github.com/google/uuid"

type UserId struct {
	value string
}

func NewUserId() UserId {
	return UserId{value: uuid.New().String()}
}

func ParseUserId(value string) (UserId, error) {
	return UserId{value: value}, nil
}

func (u UserId) Value() string {
	return u.value
}
