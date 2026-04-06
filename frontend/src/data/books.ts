export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: 'TERSEDIA' | 'PENUH' | 'HABIS' | 'DIPINJAM';
  rating?: number;
  pageCount: number;
  borrowers: string[];
  coverImage?: string;
  returnDate?: string;
  description?: string;
  isbn: string;
  year: number;
  stock: number;
  maxStock: number;
}

export const GENRES = [
  'Fiksi',
  'Misteri & Thriller',
  'Pengembangan Diri',
  'Teknologi',
  'Komik & Novel Grafis',
  'Sains & Pendidikan',
  'Bisnis & Ekonomi',
  'Agama & Spiritual'
] as const;

export type GenreType = typeof GENRES[number];

export const books: Book[] = [
  {
    id: 1,
    title: 'The Lord of the Mysteries',
    author: 'Cuttlefish That Loves Diving',
    genre: 'Fiksi',
    status: 'TERSEDIA',
    pageCount: 324,
    borrowers: ['JD', 'AK'],
    coverImage: 'https://preview.redd.it/whats-your-best-lotm-wallpapers-donghua-v0-knnjwtg0zc4f1.jpeg?width=1472&format=pjpg&auto=webp&s=659afdb9d4a741ed19bb73f99d32c8c91ad8980f',
    description: 'Antara hidup dan mati ada perpustakaan, dan di dalam perpustakaan itu, rak-raknya membentang selamanya.',
    isbn: '978-0525559474',
    year: 2020,
    stock: 19,
    maxStock: 19
  },
  {
    id: 2,
    title: 'Kalkulasi Strategis',
    author: 'RIAN CAHYOSA',
    genre: 'Bisnis & Ekonomi',
    status: 'PENUH',
    pageCount: 324,
    borrowers: ['MC'],
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
    description: 'Buku ini membahas tentang bagaimana menghitung strategi bisnis dengan tepat di era digital.',
    isbn: '978-6020312345',
    year: 2022,
    stock: 5,
    maxStock: 5
  },
  {
    id: 3,
    title: 'Dunia Tanpa Batas',
    author: 'SENO GUMIRA',
    genre: 'Fiksi',
    status: 'HABIS',
    pageCount: 412,
    returnDate: '14 Des',
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=800&auto=format&fit=crop',
    description: 'Sebuah antologi cerita pendek yang mengeksplorasi batas-bahan imajinasi manusia.',
    isbn: '978-9792209876',
    year: 2018,
    stock: 0,
    maxStock: 12
  },
  {
    id: 4,
    title: 'Semi Hidup Minimalis',
    author: 'PRADITYO A.',
    genre: 'Pengembangan Diri',
    status: 'TERSEDIA',
    pageCount: 280,
    borrowers: ['AK'],
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    description: 'Menemukan kebahagiaan dalam kesederhanaan.',
    isbn: '978-6020612340',
    year: 2021,
    stock: 8,
    maxStock: 10
  },
  {
    id: 5,
    title: 'Modern Web Architecture',
    author: 'LEE ROBINSON',
    genre: 'Teknologi',
    status: 'TERSEDIA',
    pageCount: 350,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    description: 'Panduan lengkap untuk membangun aplikasi web modern.',
    isbn: '978-1492044437',
    year: 2023,
    stock: 12,
    maxStock: 15
  },
  {
    id: 6,
    title: 'Mastering React Hooks',
    author: 'DAN ABRAMOV',
    genre: 'Teknologi',
    status: 'DIPINJAM',
    pageCount: 220,
    borrowers: ['DR'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    description: 'Pelajari cara menggunakan React Hooks secara mendalam.',
    isbn: '978-1098112345',
    year: 2022,
    stock: 1,
    maxStock: 5
  },
  {
    id: 7,
    title: 'Industrial Design Basics',
    author: 'DIETER RAMS',
    genre: 'Sains & Pendidikan',
    status: 'TERSEDIA',
    pageCount: 180,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    description: 'Sepuluh prinsip desain yang baik.',
    isbn: '978-3791381234',
    year: 1976,
    stock: 3,
    maxStock: 3
  },
  {
    id: 8,
    title: 'Sherlock Holmes',
    author: 'ARTHUR CONAN DOYLE',
    genre: 'Misteri & Thriller',
    status: 'TERSEDIA',
    pageCount: 450,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1587876222916-d452096c8cff?q=80&w=800&auto=format&fit=crop',
    description: 'Detektif paling terkenal di dunia.',
    isbn: '978-0141034355',
    year: 1892,
    stock: 4,
    maxStock: 4
  },
  {
    id: 9,
    title: 'Filosofi Teras',
    author: 'HENRY MANAMPIRING',
    genre: 'Agama & Spiritual',
    status: 'TERSEDIA',
    pageCount: 320,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    description: 'Panduan praktis untuk menerapkan ajaran Stoisisme.',
    isbn: '978-6024125189',
    year: 2019,
    stock: 15,
    maxStock: 20
  },
  {
    id: 10,
    title: 'Solo Leveling',
    author: 'CHU-GONG',
    genre: 'Komik & Novel Grafis',
    status: 'TERSEDIA',
    pageCount: 200,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=800&auto=format&fit=crop',
    description: 'Hunter terlemah dari seluruh umat manusia, Sung Jin-Woo.',
    isbn: '978-1975319434',
    year: 2018,
    stock: 10,
    maxStock: 10
  },
  {
    id: 11,
    title: 'Atomic Habits',
    author: 'JAMES CLEAR',
    genre: 'Pengembangan Diri',
    status: 'TERSEDIA',
    pageCount: 320,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
    description: 'Cara yang sangat mudah untuk membangun kebiasaan baik.',
    isbn: '978-0735211292',
    year: 2018,
    stock: 25,
    maxStock: 25
  },
  {
    id: 12,
    title: 'The Alchemist',
    author: 'PAULO COELHO',
    genre: 'Fiksi',
    status: 'TERSEDIA',
    pageCount: 208,
    borrowers: [],
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    description: 'Kisah tentang perjalanan seorang anak gembala.',
    isbn: '978-0062315007',
    year: 1988,
    stock: 12,
    maxStock: 12
  }
]
