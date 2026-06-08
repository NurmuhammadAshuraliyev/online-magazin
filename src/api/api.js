// import axios from "axios";
// import { toast } from "react-hot-toast";

// const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
// console.warn("BASE URL:", VITE_BASE_URL);

// const api = axios.create({
//   baseURL: VITE_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   validateStatus: (status) => status >= 200 && status < 500,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("user_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     console.error("API ERROR:", {
//       url: error.config?.url,
//       status: error.response?.status,
//       data: error.response?.data,
//     });

//     const message =
//       error.response?.data?.message || "Server bilan ulanishda xatolik";

//     if (
//       error.response?.status === 401 &&
//       !window.location.pathname.includes("/login")
//     ) {
//       localStorage.removeItem("user_token");
//       localStorage.removeItem("isLoggedIn");
//       window.location.href = "/login";
//     }

//     toast.error(Array.isArray(message) ? message[0] : message);
//     return Promise.reject(error);
//   },
// );

// // =========================
// // HELPERS
// // =========================
// export const toArray = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data.nasiyalar)) return data.nasiyalar;
//   if (Array.isArray(data.data)) return data.data;
//   if (Array.isArray(data.items)) return data.items;
//   if (Array.isArray(data.result)) return data.result;
//   if (Array.isArray(data.customers)) return data.customers;
//   if (Array.isArray(data.mijozlar)) return data.mijozlar;
//   for (const key of Object.keys(data)) {
//     if (Array.isArray(data[key])) return data[key];
//   }
//   return [];
// };

// export const normalizeProduct = (p = {}) => {
//   const stock = Number(
//     p.stockKg || p.currentStock || p.quantityKg || p.stock || 0,
//   );
//   return {
//     id: String(p.id || p.productId || ""),
//     productId: String(p.productId || p.id || ""),
//     name: p.name || "Nomsiz mahsulot",
//     category: p.category || "Go'sht",
//     price: Number(p.sotish || p.price || 0),
//     sotish: Number(p.sotish || p.price || 0),
//     tannarx: Number(p.tannarx || p.cost || 0),
//     stockKg: stock,
//     currentStock: stock,
//     quantityKg: stock,
//   };
// };

// // =========================
// // API SERVICE
// // =========================
// export const apiService = {
//   // ================= LOGIN
//   login: async (credentials) => {
//     try {
//       const res = await api.post("/auth/login", {
//         email: String(credentials.email || "").trim(),
//         password: String(credentials.password || "").trim(),
//       });

//       const token =
//         res?.token ||
//         res?.accessToken ||
//         res?.access_token ||
//         res?.jwt ||
//         res?.data?.token ||
//         res?.data?.accessToken ||
//         res?.data?.access_token ||
//         res?.data?.jwt;

//       const user = res?.user || res?.data?.user || res?.data;

//       if (!token) {
//         console.error("TOKEN TOPILMADI:", res);
//         toast.error("Token kelmadi!");
//         return { success: false, data: res };
//       }

//       localStorage.setItem("user_token", token);
//       localStorage.setItem("isLoggedIn", "true");
//       if (user) localStorage.setItem("user", JSON.stringify(user));

//       return { success: true, token, user };
//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       const status = err.response?.status;
//       if (status === 409) toast.error("Login yoki parol noto'g'ri");
//       else if (status === 401) toast.error("Ruxsat yo'q");
//       else if (status === 500) toast.error("Server xatosi");
//       else toast.error("Login amalga oshmadi");
//       return { success: false };
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("user_token");
//     localStorage.removeItem("isLoggedIn");
//     window.location.href = "/login";
//   },

//   // ================= PRODUCTS
//   getProducts: async () => {
//     try {
//       const res = await api.get("/products");
//       const arr = Array.isArray(res) ? res : toArray(res);
//       return arr.map(normalizeProduct);
//     } catch {
//       return [];
//     }
//   },

//   addProduct: async (data) => {
//     return api.post("/products", {
//       name: data.name,
//       tannarx: Number(data.tannarx || 0),
//       sotish: Number(data.sotish || 0),
//       category: data.category || "Go'sht",
//     });
//   },

//   updateProduct: async (id, data) => {
//     return api.put(`/products/update/${id}`, {
//       name: data.name,
//       tannarx: Number(data.tannarx || 0),
//       sotish: Number(data.sotish || 0),
//       category: data.category || "Go'sht",
//     });
//   },

//   deleteProduct: async (id) => {
//     return api.delete(`/products/delete/${id}`);
//   },

//   // ================= WAREHOUSE
//   getWarehouse: async () => {
//     try {
//       const res = await api.get("/warehouse/current");
//       return toArray(res).map(normalizeProduct);
//     } catch (err) {
//       console.log("WAREHOUSE ERROR:", err);
//       return [];
//     }
//   },

//   addWarehouseStock: async (data) => {
//     return api.post("/warehouse/in", {
//       productId: data.productId,
//       weight: Number(data.weight),
//     });
//   },

//   receiveStock: async (data) => {
//     return api.post("/warehouse/receive", {
//       productId: data.productId,
//       quantityKg: Number(data.quantityKg || 0),
//     });
//   },

//   getWarehouseHistory: async () => {
//     try {
//       const res = await api.get("/warehouse/history");
//       return toArray(res);
//     } catch {
//       return [];
//     }
//   },
//   // ================= DASHBOARD
// // ================= DASHBOARD
// getDashboardStats: async (period = "bugun") => {
//   try {
//     const res = await api.get("/dashboard/statistika", {
//       params: { period },
//     });
//     return res;
//   } catch (err) {
//     console.log("Dashboard error:", err);
//     return {};
//   }
// },

// getDashboardStats: async (period = "bugun") => {
//   const token = localStorage.getItem("user_token");

//   const res = await fetch(
//     `${VITE_BASE_URL}/dashboard/statistika?period=${period}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) throw new Error("Dashboard error");

//   return res.json();
// },
//   // ================= SALES
//   // createSale: async (data) => {
//   //   return api.post("/sale", {
//   //     items: data.items,
//   //     paymentMethod: data.paymentMethod || "NAQD",
//   //   });
//   // },

//   createSale: async (data) => {
//     return api.post("/sale", {
//       items: data.items.map((item) => ({
//         productId: item.productId || item.id, // faqat shu
//         quantityKg: Number(item.qty || item.quantityKg || 0), // faqat shu
//       })),
//       paymentMethod: data.paymentMethod || "NAQD",
//       customerName: data.customerName || null,
//       customerPhone: data.customerPhone || null,
//     });
//   },

//   getSalesHistory: async () => {
//     try {
//       const res = await api.get("/sale/history");
//       return toArray(res);
//     } catch {
//       return [];
//     }
//   },
//   // =======================================================
//   // ================= NASIYA (DEBTS)
//   // =======================================================

//   // ✅ GET /nasiya/customers — RAW javobni qaytaradi
//   getNasiyaCustomers: async (search = "") => {
//     try {
//       const params = search ? { search } : {};
//       const res = await api.get("/nasiya/customers", { params });
//       console.log(
//         "📦 RAW getNasiyaCustomers:",
//         JSON.stringify(res)?.slice(0, 500),
//       );
//       return res;
//     } catch (err) {
//       console.log("GET NASIYA CUSTOMERS ERROR:", err);
//       return null;
//     }
//   },

//   // ✅ GET /nasiya — RAW javobni qaytaradi
//   getDebts: async (params = {}) => {
//     try {
//       const query = {};
//       if (params.search) query.search = params.search;
//       if (params.status) query.status = params.status;
//       const res = await api.get("/nasiya", { params: query });
//       console.log("📦 RAW getDebts:", JSON.stringify(res)?.slice(0, 500));
//       return res;
//     } catch {
//       return null;
//     }
//   },

//   // ✅ POST /nasiya/customers
//   createNasiyaCustomer: async (data) => {
//     return api.post("/nasiya/customers", {
//       name: String(data.name || "").trim(),
//       telefon: data.telefon || data.phone || undefined,
//     });
//   },

//   updateNasiyaCustomer: async (id, data) => {
//     return api.patch(`/nasiya/customers/${id}`, {
//       name: data.name,
//       telefon: data.telefon || data.phone,
//     });
//   },

//   deleteNasiyaCustomer: async (id) => {
//     return api.delete(`/nasiya/customers/${id}`);
//   },

//   // ✅ POST /nasiya — mavjud mijozga qarz
//   createDebt: async (data) => {
//     return api.post("/nasiya", {
//       customerId: String(data.customerId || data.id || ""),
//       aslSumma: Number(data.aslSumma || data.totalDebt || data.amount || 0),
//       izoh: data.izoh || data.note || undefined,
//       saleId: data.saleId || undefined,
//     });
//   },

//   // ✅ POST /nasiya/mijoz — yangi mijoz + nasiya birga
//   // createDebtWithCustomer: async (data) => {
//   //   return api.post("/nasiya/mijoz", {
//   //     mijozIsmi: String(data.mijozIsmi || data.name || "").trim(),
//   //     telefon: data.telefon || data.phone || undefined,
//   //     aslSumma: Number(data.aslSumma || data.amount || 0),
//   //     izoh: data.izoh || undefined,
//   //   });
//   // },

//   // ✅ POST /nasiya/mijoz — yangi mijoz + nasiya birga
//   createDebtWithCustomer: async (data) => {
//     const res = await api.post("/nasiya/mijoz", {
//       mijozIsmi: String(data.mijozIsmi || data.name || "").trim(),
//       telefon: data.telefon || data.phone || undefined,
//       aslSumma: Number(data.aslSumma || data.amount || 0),
//       izoh: data.izoh || undefined,
//     });

//     // ✅ 400 javobini qo'lda tekshir
//     if (res?.statusCode === 400 || res?.error) {
//       throw new Error(res?.message || "Server xatosi");
//     }

//     return res;
//   },

//   // ✅ RAW — DebtsPage ichida parse qilinadi (toArray ISHLATILMAYDI)
//   getCustomerDebtsRaw: async (customerId) => {
//     try {
//       const res = await api.get(`/nasiya/customer/${customerId}`);
//       console.log(
//         `📦 RAW getCustomerDebts(${customerId}):`,
//         JSON.stringify(res)?.slice(0, 300),
//       );
//       return res; // RAW qaytarish
//     } catch (err) {
//       console.warn("getCustomerDebtsRaw xatolik:", err?.message);
//       return null;
//     }
//   },

//   // ✅ Eski nom — backward compatibility uchun (toArray bilan)
//   getCustomerDebts: async (customerId) => {
//     try {
//       const res = await api.get(`/nasiya/customer/${customerId}`);
//       return toArray(res);
//     } catch {
//       return [];
//     }
//   },

//   getDebtById: async (id) => {
//     try {
//       return await api.get(`/nasiya/${id}`);
//     } catch {
//       return null;
//     }
//   },

//   updateDebt: async (id, data) => {
//     return api.patch(`/nasiya/${id}`, {
//       izoh: data.izoh || data.note || "",
//     });
//   },

//   deleteDebt: async (id) => {
//     return api.delete(`/nasiya/${id}`);
//   },

//   // ✅ POST /nasiya/{id}/tolov
//   payDebt: async (id, amount, note = "") => {
//     return api.post(`/nasiya/${id}/tolov`, {
//       summa: Number(amount),
//       izoh: note || undefined,
//     });
//   },

//   // ================= STATS
//   getStats: async (period = "bugun") => {
//     try {
//       return await api.get(`/report?period=${period}`);
//     } catch {
//       return {};
//     }
//   },

//   // ================= PROFILE
//   getProfile: async () => {
//     return api.get("/profile");
//   },
// };

// export default api;
/////

import axios from "axios";
import { toast } from "react-hot-toast";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
console.warn("BASE URL:", VITE_BASE_URL);

const api = axios.create({
  baseURL: VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 500,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    const message =
      error.response?.data?.message || "Server bilan ulanishda xatolik";
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    }
    toast.error(Array.isArray(message) ? message[0] : message);
    return Promise.reject(error);
  },
);

// =========================
// HELPERS
// =========================
export const toArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.nasiyalar)) return data.nasiyalar;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.customers)) return data.customers;
  if (Array.isArray(data.mijozlar)) return data.mijozlar;
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
};

export const normalizeProduct = (p = {}) => {
  const stock = Number(
    p.stockKg || p.currentStock || p.quantityKg || p.stock || 0,
  );
  return {
    id: String(p.id || p.productId || ""),
    productId: String(p.productId || p.id || ""),
    name: p.name || "Nomsiz mahsulot",
    category: p.category || "Go'sht",
    price: Number(p.sotish || p.price || 0),
    sotish: Number(p.sotish || p.price || 0),
    tannarx: Number(p.tannarx || p.cost || 0),
    stockKg: stock,
    currentStock: stock,
    quantityKg: stock,
  };
};

// =========================
// API SERVICE
// =========================
export const apiService = {
  // ================= LOGIN
  login: async (credentials) => {
    try {
      const res = await api.post("/auth/login", {
        email: String(credentials.email || "").trim(),
        password: String(credentials.password || "").trim(),
      });
      const token =
        res?.token ||
        res?.accessToken ||
        res?.access_token ||
        res?.jwt ||
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.data?.access_token ||
        res?.data?.jwt;
      const user = res?.user || res?.data?.user || res?.data;
      if (!token) {
        console.error("TOKEN TOPILMADI:", res);
        toast.error("Token kelmadi!");
        return { success: false, data: res };
      }
      localStorage.setItem("user_token", token);
      localStorage.setItem("isLoggedIn", "true");
      if (user) localStorage.setItem("user", JSON.stringify(user));
      return { success: true, token, user };
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      const status = err.response?.status;
      if (status === 409) toast.error("Login yoki parol noto'g'ri");
      else if (status === 401) toast.error("Ruxsat yo'q");
      else if (status === 500) toast.error("Server xatosi");
      else toast.error("Login amalga oshmadi");
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  },

  // ================= PRODUCTS
  getProducts: async () => {
    try {
      const res = await api.get("/products");
      const arr = Array.isArray(res) ? res : toArray(res);
      return arr.map(normalizeProduct);
    } catch {
      return [];
    }
  },

  addProduct: async (data) =>
    api.post("/products", {
      name: data.name,
      tannarx: Number(data.tannarx || 0),
      sotish: Number(data.sotish || 0),
      category: data.category || "Go'sht",
    }),

  updateProduct: async (id, data) =>
    api.put(`/products/update/${id}`, {
      name: data.name,
      tannarx: Number(data.tannarx || 0),
      sotish: Number(data.sotish || 0),
      category: data.category || "Go'sht",
    }),

  deleteProduct: async (id) => api.delete(`/products/delete/${id}`),

  // ================= WAREHOUSE
  getWarehouse: async () => {
    try {
      const res = await api.get("/warehouse/current");
      return toArray(res).map(normalizeProduct);
    } catch (err) {
      console.log("WAREHOUSE ERROR:", err);
      return [];
    }
  },

  addWarehouseStock: async (data) =>
    api.post("/warehouse/in", {
      productId: data.productId,
      weight: Number(data.weight),
    }),

  receiveStock: async (data) =>
    api.post("/warehouse/receive", {
      productId: data.productId,
      quantityKg: Number(data.quantityKg || 0),
    }),

  getWarehouseHistory: async () => {
    try {
      return toArray(await api.get("/warehouse/history"));
    } catch {
      return [];
    }
  },

  // ================= DASHBOARD
  getDashboardStats: async (period = "bugun") => {
    try {
      return await api.get("/dashboard/statistika", { params: { period } });
    } catch (err) {
      console.log("Dashboard error:", err);
      return {};
    }
  },

  // ================= SALES
  createSale: async (data) =>
    api.post("/sale", {
      items: data.items.map((item) => ({
        productId: item.productId || item.id,
        quantityKg: Number(item.qty || item.quantityKg || 0),
      })),
      paymentMethod: data.paymentMethod || "NAQD",
      customerName: data.customerName || null,
      customerPhone: data.customerPhone || null,
    }),

  getSalesHistory: async () => {
    try {
      return toArray(await api.get("/sale/history"));
    } catch {
      return [];
    }
  },

  // =======================================================
  // ================= KASSA
  // =======================================================

  /**
   * GET /kassa?filter=bugun|hafta|oy|yil&search=...
   * Qaytaradi: { umumiyQoldiq, jamiKirim, jamiChiqim, tarixiyHarakatlar[] }
   */
  getKassa: async (filter = "bugun", search = "") => {
    try {
      const params = { filter };
      if (search) params.search = search;
      return await api.get("/kassa", { params });
    } catch (err) {
      console.log("KASSA GET ERROR:", err);
      return null;
    }
  },

  /**
   * GET /kassa/statistika?filter=bugun|hafta|oy|yil
   * Qaytaradi: { kirim, chiqim, sofFoyda, totalIncome, totalExpense }
   */
  getKassaStatistika: async (filter = "bugun") => {
    try {
      return await api.get("/kassa/statistika", { params: { filter } });
    } catch (err) {
      console.log("KASSA STATISTIKA ERROR:", err);
      return null;
    }
  },

  /**
   * POST /kassa
   * Body: { type: "income"|"expense", summa, izoh }
   * Backend ham "KIRIM"/"CHIQIM", "amount"/"description" ni qabul qiladi
   */
  addKassaHarakat: async ({ type, summa, izoh }) => {
    return api.post("/kassa", {
      type, // "income" | "expense"
      amalTuri: type === "income" ? "KIRIM" : "CHIQIM", // backup
      summa: Number(summa),
      amount: Number(summa), // backup
      izoh,
      description: izoh, // backup
    });
  },

  /**
   * DELETE /kassa/:id
   */
  deleteKassaHarakat: async (id) => {
    return api.delete(`/kassa/${id}`);
  },

  // =======================================================
  // ================= NASIYA (DEBTS)
  // =======================================================
  getNasiyaCustomers: async (search = "") => {
    try {
      const params = search ? { search } : {};
      const res = await api.get("/nasiya/customers", { params });
      console.log(
        "📦 RAW getNasiyaCustomers:",
        JSON.stringify(res)?.slice(0, 500),
      );
      return res;
    } catch (err) {
      console.log("GET NASIYA CUSTOMERS ERROR:", err);
      return null;
    }
  },

  getDebts: async (params = {}) => {
    try {
      const query = {};
      if (params.search) query.search = params.search;
      if (params.status) query.status = params.status;
      const res = await api.get("/nasiya", { params: query });
      console.log("📦 RAW getDebts:", JSON.stringify(res)?.slice(0, 500));
      return res;
    } catch {
      return null;
    }
  },

  createNasiyaCustomer: async (data) =>
    api.post("/nasiya/customers", {
      name: String(data.name || "").trim(),
      telefon: data.telefon || data.phone || undefined,
    }),

  updateNasiyaCustomer: async (id, data) =>
    api.patch(`/nasiya/customers/${id}`, {
      name: data.name,
      telefon: data.telefon || data.phone,
    }),

  deleteNasiyaCustomer: async (id) => api.delete(`/nasiya/customers/${id}`),

  createDebt: async (data) =>
    api.post("/nasiya", {
      customerId: String(data.customerId || data.id || ""),
      aslSumma: Number(data.aslSumma || data.totalDebt || data.amount || 0),
      izoh: data.izoh || data.note || undefined,
      saleId: data.saleId || undefined,
    }),

  createDebtWithCustomer: async (data) => {
    const res = await api.post("/nasiya/mijoz", {
      mijozIsmi: String(data.mijozIsmi || data.name || "").trim(),
      telefon: data.telefon || data.phone || undefined,
      aslSumma: Number(data.aslSumma || data.amount || 0),
      izoh: data.izoh || undefined,
    });
    if (res?.statusCode === 400 || res?.error) {
      throw new Error(res?.message || "Server xatosi");
    }
    return res;
  },

  getCustomerDebtsRaw: async (customerId) => {
    try {
      const res = await api.get(`/nasiya/customer/${customerId}`);
      console.log(
        `📦 RAW getCustomerDebts(${customerId}):`,
        JSON.stringify(res)?.slice(0, 300),
      );
      return res;
    } catch (err) {
      console.warn("getCustomerDebtsRaw xatolik:", err?.message);
      return null;
    }
  },

  getCustomerDebts: async (customerId) => {
    try {
      return toArray(await api.get(`/nasiya/customer/${customerId}`));
    } catch {
      return [];
    }
  },

  getDebtById: async (id) => {
    try {
      return await api.get(`/nasiya/${id}`);
    } catch {
      return null;
    }
  },

  updateDebt: async (id, data) =>
    api.patch(`/nasiya/${id}`, { izoh: data.izoh || data.note || "" }),

  deleteDebt: async (id) => api.delete(`/nasiya/${id}`),

  payDebt: async (id, amount, note = "") =>
    api.post(`/nasiya/${id}/tolov`, {
      summa: Number(amount),
      izoh: note || undefined,
    }),

  // ================= STATS
  getStats: async (period = "bugun") => {
    try {
      return await api.get(`/report?period=${period}`);
    } catch {
      return {};
    }
  },

  // ================= PROFILE
  getProfile: async () => api.get("/profile"),
};

export default api;
