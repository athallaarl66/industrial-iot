# Phase 1: Foundation - Master Data (Asset Management)

Memulai sistem dari fondasi utama: **Master Data Assets**. Sebelum kita bisa memproses masuknya ribuan data telemetri dari MQTT, kita membutuhkan data "Aset" referensi yang jelas (misal: Pompa, Sumur Bor) beserta konfigurasinya di dalam database PostgreSQL.

## Core Objective
Mengimplementasikan Clean Architecture backend untuk mengelola CRUD Aset secara efisien, dengan standardisasi Response dan Error Handling yang seragam.

---

## Proposed Changes

### 1. Domain Layer (`IndustrialIot.Domain`)
Lapisan ini bebas dari *dependency* eksternal. Hanya berisi entitas bisnis.

#### [NEW] `Entities/Asset.cs`
- Properti: `Id` (Guid), `AssetCode`, `Name`, `Status`, `Location`, `LastMaintained`.

#### [NEW] `Enums/AssetStatus.cs`
- Mengandung Enum: `Running`, `Warning`, `Critical`, `Maintenance`.

---

### 2. Infrastructure Layer (`IndustrialIot.Infrastructure`)
Implementasi persistence dengan Entity Framework Core (PostgreSQL).

#### [NEW] `Data/ApplicationDbContext.cs`
- Mendaftarkan `DbSet<Asset>`.
- Override `OnModelCreating` untuk menambahkan konfigurasi dasar dan Index (misal Index untuk `AssetCode`).

#### [NEW] `Configurations/AssetConfiguration.cs`
- Menggunakan `IEntityTypeConfiguration<Asset>` untuk mendefinisikan skema secara eksplisit (Max length untuk Name, Unique constraint untuk AssetCode).

---

### 3. Application Layer (`IndustrialIot.Application`)
Core business rules dan DTOs.

#### [NEW] `Common/ApiResponse.cs`
- Standar response JSON: `{ success, message, data, errorCode }` agar penanganan di sisi *Frontend* seragam.

#### [NEW] `DTOs/Asset/AssetDto.cs` & `CreateAssetDto.cs`
- Model untuk request dan response.

#### [NEW] `Validators/CreateAssetValidator.cs`
- Menggunakan `FluentValidation` agar *Zero Trust* diterapkan di *backend* (Contoh: Code harus unik dan format tertentu).

#### [NEW] `Services/IAssetService.cs` & `AssetService.cs`
- Logic Create, Read (dengan *AsNoTracking()* karena read-only), Update, Delete.

---

### 4. API Layer (`IndustrialIot.Api`)
Entry point web app.

#### [NEW] `Controllers/AssetsController.cs`
- HTTP GET `/api/v1/assets`
- HTTP POST `/api/v1/assets`
- Di sini akan diimplementasikan *Global Exception Handler* (middleware) agar *database error string* tidak diexpose ke luar.

---

## Resolved Discussions

**AssetCode Validation (O&G Standard):**
Karena target kita adalah proyek portfolio standar Enterprise (Oil & Gas), kita akan menerapkan **Global Industry Convention** sederhana untuk format *AssetCode*.

Aturan `AssetCode` yang akan kita enforce di Backend dengan Regex:
- **Format:** `[TIPE]-[LOKASI]-[NOMOR]`
- **Contoh:** 
  - `WH-A-001` (Wellhead, Zone A, Mesin 001)
  - `PMP-B-015` (Pump, Zone B, Mesin 015)
- **Regex Backend:** `^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$` (Hanya huruf kapital, angka, dashes).

Ini akan menunjukkan kepada rekruter bahwa kamu paham tentang *Data Standardization* di industri berat.

## Verification Plan

### Automated Tests / API Tests
- Menjalankan `dotnet ef migrations add InitialAssetCreate` dan memastikan update database berjalan lancar.
- Validasi via HTTP Client / Swagger untuk memastikan endpoint `/api/v1/assets` mengembalikan object `{ "success": true, ... }` dengan benar tanpa *expose* Error 500 mentah.

### Manual Verification
- Cek DB dengan `docker exec` (atau DBeaver) untuk memastikan tabel `Assets` terbuat dan constraints PostgreSQL-nya beroperasi sesuai harapan.
