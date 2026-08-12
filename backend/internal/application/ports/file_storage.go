package ports

import (
	"context"
)

type FileStorage interface {
	Upload(ctx context.Context, path string, data []byte, contentType string) (string, error)
	Delete(ctx context.Context, path string) error
	GenerateSignedUploadURL(ctx context.Context, path string, contentType string) (string, error)
	GetPublicURL(path string) string
}
