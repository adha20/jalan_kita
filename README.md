# 🛣️ JalanKita - Lapor, Pantau, Wujudkan Jalan Lebih Baik!

Aplikasi mobile berbasis **React Native & Expo** untuk pelaporan dan pemantauan kerusakan jalan/infrastruktur publik secara partisipatif dengan sistem gamifikasi poin reward dan portal tindak lanjut dinas.

---

## 📱 Fitur Utama

- **Kamera Bukti Ber-Watermark Otomatis**: Memotret jalan rusak dilengkapi koordinat GPS (*Latitude, Longitude*) dan stempel waktu otomatis anti-duplikasi.
- **Input Suara (Voice-to-Text)**: Memudahkan warga menyampaikan deskripsi laporan menggunakan suara via mikrofon.
- **Peta Interaktif OpenStreetMap & Heatmap**: Pemetaan sebaran laporan dengan filter status (*Rusak, Diperbaiki, Selesai*) serta visualisasi kepadatan titik kerusakan.
- **Pelacakan Progres (Timeline Stepper)**: Memantau status laporan mulai dari *Terkirim*, *Diterima Dinas*, *Sedang Dikerjakan*, hingga *Selesai*.
- **Gamifikasi & Reward Poin**: Setiap laporan valid menghasilkan poin yang dapat ditukarkan dengan berbagai voucher menarik.
- **Portal Petugas Dinas PUPR**: Dashboard untuk petugas instansi dalam memverifikasi, menugaskan tim lapangan, dan menyelesaikan laporan perbaikan.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 58) + [React Native](https://reactnative.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Navigasi**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing)
- **Kamera & Lokasi**: `expo-camera`, `expo-location`
- **Voice-to-Text**: `expo-speech-recognition`
- **Peta**: Leaflet & OpenStreetMap (Cross-platform)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)

---

## 🚀 Cara Menjalankan Proyek

1. **Clone repositori**:
   ```bash
   git clone https://github.com/adha20/jalan_kita.git
   cd jalan_kita
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan aplikasi**:
   ```bash
   npx expo start
   ```
   - Pindai QR Code menggunakan aplikasi **Expo Go** di Android atau Kamera di iOS.
   - Atau tekan tombol `w` di terminal untuk membuka tampilan web di browser.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT.
