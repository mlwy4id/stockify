.PHONY: test test-unit test-race test-cover test-cover-html vet

test:
	go test ./...

test-unit:
	go test ./internal/...

test-race:
	go test -race ./...

# Instruments exactly the packages under test (application, domain, and the
# four tested http packages), matching the coverage scope of the testing report.
# internal/test (mocks), internal/http/category (no tests yet) and cmd (wiring)
# are excluded.
COVERPKG := ./internal/application/...,./internal/domain/...,./internal/http/auth/...,./internal/http/middleware/...,./internal/http/product/...,./internal/http/stock_movement/...

test-cover:
	go test -coverpkg=$(COVERPKG) -coverprofile=cover.out ./... && go tool cover -func=cover.out | tail -n 40

test-cover-html:
	go test -coverpkg=$(COVERPKG) -coverprofile=cover.out ./... && go tool cover -html=cover.out -o cover.html

vet:
	go vet ./...
