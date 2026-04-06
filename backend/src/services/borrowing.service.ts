import {
  createBorrowingRepo,
  deleteBorrowingRepo,
  getBorrowingByIdRepo,
  getListBorrowingRepo,
  updateBorrowingRepo,
  getMyBorrowingsRepo,
  checkActiveBorrowingRepo,
} from "@/repositories/borrowing.repository";
import { getBookByIdRepo, updateBookStockRepo } from "@/repositories/book.repository";
import { HttpException } from "@/utils/httpException";
import { IUpdateBorrowing, ICreateBorrowing } from "@/types/borrowing.type";
import { BorrowingStatus } from "@prisma";
import crypto from "crypto";

/**
 * Service untuk membuat pengajuan peminjaman baru.
 */
export const createBorrowing = async (data: ICreateBorrowing) => {
  // 1. Cek stok buku
  const book = await getBookByIdRepo(data.bookId);
  if (!book) {
    throw new HttpException(404, "Buku tidak ditemukan");
  }

  if (book.stock <= 0) {
    throw new HttpException(400, "Maaf, stok buku ini sedang habis");
  }

  // 2. Cek apakah user sudah meminjam buku ini dan belum dikembalikan
  const activeBorrowing = await checkActiveBorrowingRepo(data.userId, data.bookId);
  if (activeBorrowing) {
    throw new HttpException(
      400, 
      "Anda sudah memiliki peminjaman aktif untuk buku ini. Silakan selesaikan peminjaman sebelumnya."
    );
  }

  // 3. Kurangi stok buku segera setelah pengajuan (Immediate feedback)
  await updateBookStockRepo(data.bookId, -1);

  return await createBorrowingRepo(data);
};

/**
 * Service untuk mendapatkan daftar seluruh peminjaman (Hanya ADMIN).
 */
export const getListBorrowing = async (
  page?: number,
  limit?: number,
  status?: BorrowingStatus
) => {
  return await getListBorrowingRepo(page, limit, status);
};

/**
 * Service untuk mendapatkan riwayat pribadi pengguna.
 */
export const getMyBorrowings = async (userId: string) => {
  if (!userId) {
    throw new HttpException(401, "Sesi tidak valid, silakan login kembali");
  }
  return await getMyBorrowingsRepo(userId);
};

/**
 * Service untuk melihat satu detail peminjaman.
 */
export const getBorrowingById = async (id: string) => {
  const borrowing = await getBorrowingByIdRepo(id);
  if (!borrowing) {
    throw new HttpException(404, "Data peminjaman tidak ditemukan");
  }
  return borrowing;
};

/**
 * Service untuk memperbarui status peminjaman (Persetujuan, Pengambilan, Pengembalian).
 * Menyertakan pembuatan kode otomatis dan update stok buku.
 */
export const updateBorrowing = async (
  updateData: IUpdateBorrowing,
  id: string
) => {
  const existing = await getBorrowingById(id);

  const data = { ...updateData };

  // 1. Logika Persetujuan (APPROVED): Generate Kode Ambil
  if (
    data.status === BorrowingStatus.APPROVED &&
    existing.status === BorrowingStatus.PENDING
  ) {
    // Stok sudah dikurangi saat pengajuan (PENDING)
    data.pickupCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  // 2. Logika Pengambilan (BORROWED): Validasi Kode Ambil & Generate Kode Kembali
  if (
    data.status === BorrowingStatus.BORROWED &&
    existing.status === BorrowingStatus.APPROVED
  ) {
    if (!data.code || data.code !== existing.pickupCode) {
      throw new HttpException(400, "Kode pengambilan tidak valid");
    }
    // Stok sudah dikurangi saat pengajuan (PENDING)
    data.returnCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    data.borrowDate = new Date();
  }

  // 3. Logika Pengembalian (RETURNED): Validasi Kode Kembali & Update Stok
  if (
    data.status === BorrowingStatus.RETURNED &&
    existing.status === BorrowingStatus.BORROWED
  ) {
    if (!data.code || data.code !== existing.returnCode) {
      throw new HttpException(400, "Kode pengembalian tidak valid");
    }
    await updateBookStockRepo(existing.bookId, 1);
    data.returnDate = new Date();
  }

  if (
    data.status === BorrowingStatus.REJECTED &&
    (existing.status === BorrowingStatus.PENDING || 
     existing.status === BorrowingStatus.APPROVED || 
     existing.status === BorrowingStatus.BORROWED)
  ) {
    await updateBookStockRepo(existing.bookId, 1);
  }

  // Pembersihan field bantu 'code' agar tidak masuk ke Prisma secara langsung
  delete data.code;

  return await updateBorrowingRepo(data, id);
};

/**
 * Service untuk menghapus catatan peminjaman.
 */
export const deleteBorrowing = async (id: string) => {
  const existing = await getBorrowingById(id);
  
  // Jika peminjaman sedang berjalan (PENDING, APPROVED, atau BORROWED), kembalikan stok saat data dihapus
  if (
    existing.status === BorrowingStatus.PENDING || 
    existing.status === BorrowingStatus.APPROVED || 
    existing.status === BorrowingStatus.BORROWED
  ) {
    await updateBookStockRepo(existing.bookId, 1);
  }

  return await deleteBorrowingRepo(id);
};
