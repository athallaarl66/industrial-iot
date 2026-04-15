# 01. Panduan Pengembangan - Module Aset (Master Data)

Dokumen ini menjelaskan apa yang sedang kita bangun SEKARANG (Tahap 1) dan bagaimana posisinya di dalam sistem Industrial IoT.

## Posisi Sistem Saat Ini (Dimana Kita?)
👉 **KITA SEDANG FOKUS DI BACKEND (.NET) SAJA.**
Frontend (React) belum kita sentuh sama sekali. 

Sebelum Frontend bisa menampilkan data, dan sebelum Simulator bisa mengirim telemetri MQTT, kita butuh "buku induk" (katalog) yang menyimpan daftar alat/mesin apa saja yang ada di pabrik. Inilah yang sedang kita kerjakan.

## Kenapa Mulai Dari Sini?
Tanpa tabel `Assets` di database, kita tidak bisa menyimpan riwayat suhu/tekanan (Telemetry) karena data suhu tersebut harus "diikat" (direlasikan) ke sebuah `AssetId`.

## Alur Data Modul Aset Saat Ini (Backend Clean Architecture)

Setiap request dari Frontend (atau Postman) nantinya akan melewati 4 lapis/layer keamanan berikut yang baru saja kita kerjakan di folder `server/`:

### Layer 1: API (Belum Dibuat)
Berisi *Controller* yang menerima Request HTTP. Contoh: User mengeklik "Tambah Mesin" di Frontend. API akan menerima request JSON tersebut.

### Layer 2: Application DTO & Validator (✔️ Selesai Dibuat)
- **`CreateAssetDto`**: Mengubah request JSON menjadi objek mentah C#.
- **`CreateAssetValidator`**: Secara otomatis menolak request jika format `AssetCode` tidak sesuai standar Oil & Gas (Contoh: `PMP-A-001`). Jika gagal, API langsung mengembalikan Error 400 Bad Request tanpa menyentuh Database.

### Layer 3: Application Service (⏳ Sedang Berjalan)
- **`AssetService`**: Tempat *Business Logic* (Logika Bisnis). Service ini akan memanggil infrastruktur database untuk mengecek apakah `AssetCode` sudah dipakai oleh mesin lain atau belum.

### Layer 4: Domain & Infrastructure (✔️ Selesai Dibuat)
- **`AssetStatus Enum`**: Mengatur status mesin (0 = Running, 1 = Warning, 2 = Critical, 3 = Maintenance).
- **`AppDbContext`**: Mengeksekusi EF Core query untuk menyimpan C# objek ke tabel PostgreSQL (`INSERT INTO Assets...`).

## Kesimpulan
Kita sedang membangun pondasi utama untuk menerima input mesin. Pekerjaan BE (Backend) ini harus kokoh, karena di industri berat (Industrial IoT), jika `AssetId` rusak atau duplikat, jutaan baris log telemetri akan kacau.
