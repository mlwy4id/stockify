package event

type CategoryDeleted struct {
	CategoryID string
}

func (e CategoryDeleted) EventType() string {
	return "CategoryDeleted"
}
