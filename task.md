# Phase 1: Asset Master Data

Checklist untuk mengimplementasikan Manajemen Aset di backend.

- `[x]` **Domain Layer**
  - Buat enum `AssetStatus` (Running, Warning, Critical, Maintenance).
  - Buat entitas `Asset` (Id, AssetCode, Name, dll).
- `[ ]` **Infrastructure Layer**
  - Definisi `ApplicationDbContext` dan koneksi Npgsql.
  - Tambahkan Entity Configuration `IEntityTypeConfiguration<Asset>` dengan aturan *Unique* untuk AssetCode.
  - Registrasi Context di Dependency Injection.
- `[ ]` **Database Migration**
  - Buat skrip migrasi awal via EF Core.
  - Update struktur database lokal.
- `[/]` **Application Layer (DTOs & Validation)**
  - `ApiResponse<T>` formater standar.
  - `AssetDto` dan `CreateAssetDto`.
  - Install `FluentValidation` dan buat `CreateAssetValidator` enforcing regex O&G format.
  - Define `IAssetService` dan implementasi `AssetService`.
- `[ ]` **API Layer**
  - Buat `AssetsController` (GET dan POST awal).
  - Test via Swagger.
