# Stockify — System Architecture

> High-level view in [§1](#1-high-level-architecture); low-level backend view in [§3](#3-low-level-backend-view).

## 1. High-Level Architecture

```mermaid
flowchart LR
    Client["Browser<br/>(Client)"]

    subgraph FE["Frontend — Vercel"]
        Next["Next.js App<br/>(React 19, TanStack Query)"]
    end

    subgraph BE["Backend — Google Cloud Run"]
        API["Go API<br/>(Gin + JWT auth)"]
    end

    subgraph DATA["Data & Storage"]
        PG[("PostgreSQL")]
        GCS[("Google Cloud Storage")]
    end

    Client -- "HTTPS" --> Next
    Next -- "REST /api<br/>(JWT in httpOnly cookie)" --> API
    API -- "Gorm" --> PG
    API -- "generate presigned URL" --> GCS
    Next -. "direct upload<br/>(presigned URL)" .-> GCS
```

## 2. Components

| Component | Tech | Responsibility |
|---|---|---|
| Client | Browser | User interface, session cookie |
| Frontend | Next.js 15, React 19, TanStack Query, Vercel | Rendering, data fetching, direct-to-GCS uploads |
| Backend API | Go 1.25, Gin, Gorm, Cloud Run | Auth, business logic, REST API, presigned URL generation |
| Database | PostgreSQL | Users, categories, products, stock movements |
| Object storage | Google Cloud Storage | Product images |

## 3. Low-Level Backend View

### 3.1 Layers & Dependencies

Dependencies point **inward** (Clean / Hexagonal architecture): `http → application → domain`, while `infrastructure` implements interfaces declared by the inner layers.

```mermaid
flowchart TB
    subgraph HTTP["internal/http — Delivery"]
        Router["router.go<br/>routes + CORS + Swagger"]
        MW["middleware/auth.go<br/>JWT from httpOnly cookie"]
        Handlers["handlers<br/>auth · category · product · stock_movement"]
        Req["*_request.go<br/>request structs"]
    end

    subgraph APP["internal/application — Use Cases"]
        Cmd["command/*<br/>write use cases"]
        Qry["query/*<br/>read use cases"]
        DTO["dto/*<br/>response shapes"]
        Ports["ports.FileStorage<br/>(interface)"]
    end

    subgraph DOM["internal/domain — Business Core"]
        Entity["entity/*<br/>Product · Category · StockMovement · User"]
        VO["values_object/*<br/>UserId · ProductId · Quantity · ..."]
        RepoIface["repository/*<br/>(interfaces)"]
        DomainSvc["service/*<br/>category deletion rules"]
        Enum["enum/*"]
    end

    subgraph INFRA["internal/infrastructure — Adapters"]
        RepoImpl["repository/*<br/>Gorm implementations"]
        Models["database/model/*<br/>ORM structs"]
        Migrations["database/migrate.go + migrations/"]
        GCS["storage/gcs/*<br/>signed URL + upload"]
    end

    PG[("PostgreSQL")]
    Bucket[("GCS bucket")]

    Router --> MW
    MW --> Handlers
    Handlers --> Req
    Handlers --> Cmd
    Handlers --> Qry
    Handlers -. "returns" .-> DTO
    Cmd --> Entity
    Cmd --> VO
    Cmd --> RepoIface
    Cmd --> DomainSvc
    Qry --> RepoIface
    Qry --> DTO

    RepoImpl -. "implements" .-> RepoIface
    RepoImpl --> Models
    Models --> PG
    Migrations --> PG
    GCS -. "implements" .-> Ports
    Handlers --> Ports
    GCS --> Bucket
```

### 3.2 Write Path — Create Product

`POST /api/product/` (`ProductHandler.Create`).

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant R as Gin Router
    participant M as Auth Middleware
    participant H as ProductHandler
    participant CH as CreateProductCommandHandler
    participant E as Product entity
    participant Repo as ProductRepository
    participant DB as PostgreSQL

    C->>R: POST /api/product/ (cookie: token)
    R->>M: middleware.Auth()
    M->>M: validate JWT, set userId in context
    M-->>R: next
    R->>H: Create(ctx)
    H->>H: BindJSON + build Quantity / StockThreshold / CategoryId
    H->>CH: Handle(ctx, CreateProductCommand)
    CH->>E: NewProduct(userId, ...)
    E-->>CH: *Product
    CH->>Repo: Save(ctx, product)
    Repo->>DB: transaction: INSERT product (+ pending stock movements)
    DB-->>Repo: ok
    Repo-->>CH: nil
    CH-->>H: productId
    H-->>C: 201 { product_id }
```

> `ProductRepository` is the `internal/domain/repository` interface; the Gorm implementation in `internal/infrastructure/repository` is injected at startup.

### 3.3 Image Upload — Signed GCS URL

`POST /api/product/upload-url` (`ProductHandler.GetUploadURL`), then a direct client → GCS upload.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant H as ProductHandler.GetUploadURL
    participant FS as FileStorage (port)
    participant G as gcsStorage adapter
    participant B as GCS bucket

    C->>H: POST /api/product/upload-url
    H->>H: validate content type, build path products/{userId}/{uuid}
    H->>FS: GenerateSignedUploadURL(ctx, path, contentType)
    FS->>G: SignedURL PUT, expires 15m
    G-->>H: signedUrl
    H-->>C: 200 { signedUrl, path, publicUrl }
    C->>B: PUT image bytes (direct)
    B-->>C: 200 OK
    C->>H: POST /api/product/ with imageUrl
```

### 3.4 Layer → Folder Map

| Layer | Folder | Depends on | Contains |
|---|---|---|---|
| Delivery | `internal/http` | application, domain, ports | router, JWT middleware, handlers, request structs |
| Application | `internal/application` | domain | command + query handlers, response DTOs, `FileStorage` port |
| Domain | `internal/domain` | — | entities, value objects, repository interfaces, domain services, enums |
| Infrastructure | `internal/infrastructure` | domain, application | Gorm repositories, DB models, migrations, GCS adapter |
| Composition root | `cmd/api/main.go` | all | manual dependency injection / wiring |
