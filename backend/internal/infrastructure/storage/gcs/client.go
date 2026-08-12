package gcs

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/storage"
	"github.com/mlwy4id/stockify/internal/application/ports"
)

type gcsStorage struct {
	client     *storage.Client
	bucketName string
}

var _ ports.FileStorage = (*gcsStorage)(nil)

func NewGCSStorage(ctx context.Context, cfg Config) (ports.FileStorage, error) {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create gcs client: %w", err)
	}

	return &gcsStorage{
		client:     client,
		bucketName: cfg.BucketName,
	}, nil
}

func (s *gcsStorage) Upload(ctx context.Context, path string, data []byte, contentType string) (string, error) {
	objHandler := s.client.Bucket(s.bucketName).Object(path)
	storageWriter := objHandler.NewWriter(ctx)
	storageWriter.ContentType = contentType

	if _, err := storageWriter.Write(data); err != nil {
		storageWriter.Close()
		return "", fmt.Errorf("failed to write object: %w", err)
	}

	if err := storageWriter.Close(); err != nil {
		return "", fmt.Errorf("failed to close writer: %w", err)
	}

	return path, nil
}

func (s *gcsStorage) Delete(ctx context.Context, path string) error {
	objHandler := s.client.Bucket(s.bucketName).Object(path)
	if err := objHandler.Delete(ctx); err != nil {
		return fmt.Errorf("failed to delete object: %w", err)
	}
	return nil
}

func (s *gcsStorage) GenerateSignedUploadURL(ctx context.Context, path string, contentType string) (string, error) {
	signedUrlOpts := &storage.SignedURLOptions{
		Method:      "PUT",
		Expires:     time.Now().Add(15 * time.Minute),
		ContentType: contentType,
	}

	signedUrl, err := s.client.Bucket(s.bucketName).SignedURL(path, signedUrlOpts)
	if err != nil {
		return "", fmt.Errorf("failed to generate signed url: %w", err)
	}
	return signedUrl, nil
}

func (s *gcsStorage) GetPublicURL(path string) string {
	return fmt.Sprintf("https://storage.googleapis.com/%s/%s", s.bucketName, path)
}
