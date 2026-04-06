# 📚 Digital Atelier (Perpustakaan) - Backend

[![leapwithluvi](https://custom-icon-badges.demolab.com/badge/made%20by%20-leapwithluvi-556bf2?logo=github&logoColor=white&labelColor=101827)](https://github.com/leapwithluvi)
[![Top Language](https://img.shields.io/github/languages/top/leapwithluvi/usk-perpustakaan?logo=github&logoColor=%23007ACC&label=TypeScript)](https://www.typescriptlang.org/)

## 📖 Daftar Isi

<details><summary>Klik untuk melihat Daftar Isi</summary>

- [Deskripsi](#-deskripsi)
- [Fitur Utama](#-fitur-utama)
- [Struktur Folder](#-struktur-folder)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Mulai Sekarang](#-mulai-sekarang)
  - [Prasyarat](#-prasyarat)
  - [Instalasi](#-instalasi)
  - [Jalankan Secara Lokal](#-jalankan-secara-lokal)
- [Skrip (Scripts)](#-skrip-scripts)
- [Variabel Lingkungan (Env)](#-variabel-lingkungan-env)

</details>

## 📝 Deskripsi

**Digital Atelier (USK Perpustakaan)** adalah backend premium dan siap produksi yang dirancang untuk membangun sistem manajemen perpustakaan yang skalabel dan kuat. Proyek ini menggabungkan kekuatan **Express 5**, **TypeScript**, dan **Prisma ORM** dengan fokus ketat pada keamanan, observabilitas, dan arsitektur yang bersih (*clean architecture*).

Baik Anda membangun layanan kecil atau aplikasi perusahaan yang kompleks, fondasi ini memberikan apa yang Anda butuhkan untuk meluncur dengan percaya diri.

## ✨ Fitur Utama

- **🛡️ Keamanan yang Ditingkatkan**: Pra-konfigurasi dengan Helmet, HPP, CORS, dan Rate Limiting.
- **⚡ Performa Tinggi**: Dibangun di atas Express 5 dengan penanganan asinkron yang dioptimalkan.
- **🦾 Validasi Ketat**: Validasi berbasis Zod untuk body request, parameter, dan bahkan variabel lingkungan saat awal dijalankan.
- **📊 Logging Observabel**: Pencatatan JSON terstruktur menggunakan **Pino** dan `pino-http`.
- **🏗️ Arsitektur Berlapis**: Pemisahan tanggung jawab yang bersih (Controller, Service, Repository).
- **🧪 Siap Pengujian**: Pra-konfigurasi dengan **Jest** untuk pengujian unit dan integrasi.

## 📂 Struktur Folder

<details><summary><b>Tata Letak Proyek</b></summary>

```bash
src/
├── __tests__/      # Pengujian unit dan integrasi otomatis (Jest)
├── config/         # Konfigurasi terpusat (Env, Logger, Prisma)
├── controllers/    # Orkesrasi permintaan dan logika HTTP
├── middlewares/    # Penanganan Keamanan, Auth, Logging, dan Error
├── repositories/   # Lapisan akses data (abstraksi Prisma)
├── routers/        # Definisi endpoint API
├── services/       # Implementasi logika bisnis inti
├── types/          # Antarmuka TypeScript dan tipe bersama
├── utils/          # Fungsi utilitas global (JWT, Formatter)
├── validations/    # Skema Zod untuk validasi permintaan
├── app.ts          # Setup aplikasi Express
└── index.ts        # Titik masuk utama (Entry point)
```

</details>

## ✨ Teknologi yang Digunakan

<details><summary>Proyek ini dibangun menggunakan stack premium berikut:</summary>

- [TypeScript](https://www.typescriptlang.org/): Superset JavaScript untuk kode yang lebih solid.
- [Express 5](https://expressjs.com/): Framework web legendaris, diperbarui untuk masa depan.
- [Prisma](https://www.prisma.io/): ORM Node.js dan TypeScript generasi berikutnya.
- [PostgreSQL](https://www.postgresql.org/): Database open-source paling canggih di dunia.
- [Zod](https://zod.dev/): Deklarasi dan validasi skema fokus pada TypeScript.
- [Pino](https://getpino.io/): Logger Node.js yang sangat cepat dengan overhead rendah.
- [Jest](https://jestjs.io/): Framework pengujian JavaScript yang menyenangkan.
- [Helmet](https://helmetjs.github.io/): Mengamankan aplikasi Express melalui header HTTP.

</details><br/>

[![Technologies Used](https://skillicons.dev/icons?i=ts,nodejs,express,prisma,postgres,supabase)](https://skillicons.dev)

## 🧰 Mulai Sekarang

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer Anda.

### 📋 Prasyarat

- **Node.js** (v18+)
- **PostgreSQL** (pastikan instance sudah berjalan)
- **NPM** atau **Yarn**

### ⚙️ Instalasi

**Langkah 1: Clone Repositori**

```bash
git clone https://github.com/leapwithluvi/usk-perpustakaan.git
cd usk-perpustakaan/backend
```

**Langkah 2: Instal Dependensi**

```bash
npm install
```

**Langkah 3: Atur Lingkungan (Environment)**

```bash
cp .env.example .env
# Edit .env dengan DATABASE_URL dan JWT secret Anda
```

**Langkah 4: Migrasi Database**

```bash
npx prisma migrate dev
```

### 🚀 Jalankan Secara Lokal

```bash
# Mode pengembangan dengan hot-reload
npm run dev

# Build produksi
npm run build
npm start
```

## 📜 Skrip (Scripts)

| Skrip                 | Aksi                                             |
| :-------------------- | :----------------------------------------------- |
| `npm run dev`         | Menjalankan server dev lokal dengan `tsx watch`  |
| `npm run build`       | Mengompilasi TS ke JS produksi (`dist/`)         |
| `npm start`           | Menjalankan hasil build produksi                 |
| `npm test`            | Mengeksekusi pengujian menggunakan Jest          |
| `npm run lint`        | Menjalankan ESLint untuk kualitas kode           |
| `npm run prisma:generate` | Menghasikan Prisma client                   |
| `npm run prisma:migrate` | Menjalankan migrasi database                 |

## 🔒 Variabel Lingkungan (Env)

Aplikasi ini menggunakan **validasi ketat**—jika variabel ini hilang atau tidak valid, aplikasi tidak akan berjalan.

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
PORT=3000
NODE_ENV="development" # atau "production"

# JWT
JWT_SECRET="your-super-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---
Dibuat oleh [leapwithluvi](https://github.com/leapwithluvi)
