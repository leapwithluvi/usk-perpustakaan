/**
 * Utilitas untuk mengubah string menjadi slug format (lowercase, hyphen-separated).
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w-]+/g, "") // Hapus semua karakter non-word (kecuali -)
    .replace(/--+/g, "-") // Ganti ganda - dengan tunggal -
    .replace(/^-+/, "") // Hapus - di awal
    .replace(/-+$/, ""); // Hapus - di akhir
};
