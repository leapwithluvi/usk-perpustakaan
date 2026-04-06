const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const IMAGE_BASE_URL = "http://localhost:3000";

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token: string) => localStorage.setItem("token", token);
export const removeAuthToken = () => localStorage.removeItem("token");

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }

  return data; // Keep returning 'data' because 'data' contains { success, message, status, data: { ... } }
  // Wait, if I return 'data', then in component I do 'res.data.data'. 
  // Let's make it 'return data' but explain that 'data.data' is where the actual payload is.
  // Actually, let's look at getMe: it returns { success, message, status, data: { user... } }
  // So res.data is the user. Correct.
  // For getBooks, it returns { success, message, status, data: { data: [], meta: {} } }
  // So res.data.data is the array.
}

export const api = {
  // AUTH
  login: (credentials: any) => fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  register: (userData: any) => fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  }),
  getMe: () => fetchWithAuth("/auth/me"),

  // BOOKS
  getBooks: (params: { page?: number; limit?: number; search?: string; categoryId?: string; categorySlug?: string; availability?: 'tersedia' | 'habis' } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.categoryId && params.categoryId !== "all") query.append("categoryId", params.categoryId);
    if (params.categorySlug) query.append("categorySlug", params.categorySlug);
    if (params.availability) query.append("availability", params.availability);
    
    return fetchWithAuth(`/books?${query.toString()}`);
  },
  getBookById: (id: string | number) => fetchWithAuth(`/books/${id}`),
  getBookBySlug: (slug: string) => fetchWithAuth(`/books/slug/${slug}`),
  createBook: (bookData: any) => fetchWithAuth("/books", {
    method: "POST",
    body: JSON.stringify(bookData),
  }),
  updateBook: (id: string | number, bookData: any) => fetchWithAuth(`/books/${id}`, {
    method: "PATCH",
    body: JSON.stringify(bookData),
  }),
  deleteBook: (id: string | number) => fetchWithAuth(`/books/${id}`, {
    method: "DELETE",
  }),

  // CATEGORIES
  getCategories: () => fetchWithAuth("/categories"),
  getCategoryById: (id: string | number) => fetchWithAuth(`/categories/${id}`),
  getCategoryBySlug: (slug: string) => fetchWithAuth(`/categories/slug/${slug}`),
  createCategory: (categoryData: any) => fetchWithAuth("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  }),
  updateCategory: (id: string | number, categoryData: any) => fetchWithAuth(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(categoryData),
  }),
  deleteCategory: (id: string | number) => fetchWithAuth(`/categories/${id}`, {
    method: "DELETE",
  }),

  // UPLOAD
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await fetch(`${API_BASE_URL}/upload/single`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Upload gagal");
    return data;
  },

  // BORROWING
  getBorrowings: (params: { page?: number; limit?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.status && params.status !== "ALL") query.append("status", params.status);
    
    return fetchWithAuth(`/borrowing?${query.toString()}`);
  },
  createBorrowing: (data: any) => fetchWithAuth("/borrowing", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  updateBorrowing: (id: string, data: any) => fetchWithAuth(`/borrowing/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
  getMyBorrowings: () => fetchWithAuth("/borrowing/my"),

  // USERS
  getUsers: () => fetchWithAuth("/user"),
  getUserById: (id: string) => fetchWithAuth(`/user/${id}`),
  updateUser: (id: string, userData: any) => fetchWithAuth(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  }),

  // DASHBOARD
  getDashboardStats: () => fetchWithAuth("/dashboard/stats"),
  getPublicStats: () => fetchWithAuth("/dashboard/public-stats"),
};
