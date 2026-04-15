# Frontend UI/UX Architecture - Enterprise IoT Dashboard

Karena ini dikhususkan untuk portofolio O&G Level Enterprise (Bukan Dashboard Admin Biasa), kita akan menskalakan arsitektur *Frontend* agar sangat *comprehensive* dan terlihat rumit (namun menggunakan struktur komponen *React* yang dapat di-*reuse*).

Nantinya *sidebar navigation* akan terlihat penuh dan profesional.

## Struktur Halaman (Sitemap)

### 1. 🎛️ Command Center (Live Dashboard)
- **Fungsi:** Tampilan mata-elang (Bird's-eye view) untuk pengawas fasilitas.
- **Isi:**
  - Peta Interaktif atau Grid dari seluruh Aset O&G.
  - *Cards* Status Aset Live (berkedip jika merah/kritis menggunakan *SignalR WebSockets*).
  - *Aggregated Metrics* (Total mesin aktif, total mesin bermasalah).

### 2. 🔍 Asset Digital Twin (Detail Aset Spesifik)
- **Fungsi:** Membedah SATU mesin secara detail. *User* mengklik salah satu mesin di Command Center, dan diarahkan ke halaman ini.
- **Isi:**
  - *Real-time Line Chart* historis per sensor (Tekanan, Getaran, Suhu) dengan fitur *zoom-in/out*.
  - Panel "SCADA Remote Control" (Tombol *Emergency Shutdown* yang menembak fungsi MQTT *publish* ke lapangan).

### 3. 🗄️ Asset Fleet Management (Master Data)
- **Fungsi:** Halaman Manajemen Data (CRUD standar).
- **Isi:** Registrasi spesifikasi mesin baru, modifikasi *AssetCode*, dan penghapusan mesin dari sistem.

### 4. 🚨 Diagnostic & Alert Log
- **Fungsi:** Pusat riwayat *anomaly detection*.
- **Isi:**
  - Tabel berisi *log overheat* atau anomali.
  - Fitur Filter berdasarkan keparahan (Warning/Critical) dan rentang tanggal.

### 5. 🛠️ Maintenance Work Orders (MRO)
- **Fungsi:** Tindakan dari *Alert*. Teknisi membuat tiket perbaikan.
- **Isi:** 
  - *Form assignment* teknisi (Membawa status Alert menjadi "Under Maintenance").
  - Riwayat kapan terakhir kali mesin diservis (*Last Maintained*).

### 6. 👥 Role-Based Access Control (RBAC) Settings
- **Fungsi:** Keamanan level korporat.
- **Isi:** Pengaturan hak akses (misal *Role Viewer* tidak boleh memencet tombol *Emergency Stop*, hanya *Role Admin/Engineer* yang boleh).

---

## Urut-urutan Pengembangan:
Kita tetap tidak bisa membuat halaman-halaman di atas sebelum **Backend Master Data (Nomor 3)** selesai. Itulah kenapa Tahap 1 kita saat ini fokus di *AssetService* di .NET. 
