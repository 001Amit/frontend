import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsAPI,
  fetchProductAPI,
  searchAutocompleteAPI,
} from "./productAPI";

/* ================= FETCH ALL PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const res = await fetchProductsAPI(params);
      return { ...res.data, page: params.page || 1 }; // 👈 pass page
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

/* ================= FETCH SINGLE PRODUCT ================= */
export const fetchProduct = createAsyncThunk(
  "product/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await fetchProductAPI(id);
      return res.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch product");
    }
  }
);

/* ================= AUTOCOMPLETE ================= */
export const autocomplete = createAsyncThunk(
  "product/autocomplete",
  async (q, thunkAPI) => {
    try {
      const res = await searchAutocompleteAPI(q);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue([]);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    suggestions: [],

    loading: false,      // first load
    loadingMore: false,  // infinite scroll load

    page: 1,
    pages: 1,
    total: 0,
    limit: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------- ALL PRODUCTS -------- */
      .addCase(fetchProducts.pending, (s, a) => {
        if ((a.meta.arg?.page || 1) === 1) {
          s.loading = true;
        } else {
          s.loadingMore = true;
        }
      })

      .addCase(fetchProducts.fulfilled, (s, a) => {
        const newProducts = a.payload.products;

        // ✅ IMPORTANT: append for infinite scroll
        if (a.payload.page === 1) {
          s.products = newProducts;
        } else {
          s.products = [...s.products, ...newProducts];
        }

        s.page = a.payload.pagination.page;
        s.pages = a.payload.pagination.pages;
        s.total = a.payload.pagination.total;
        s.limit = a.payload.pagination.limit;

        s.loading = false;
        s.loadingMore = false;
      })

      .addCase(fetchProducts.rejected, (s) => {
        s.loading = false;
        s.loadingMore = false;
      })

      /* -------- SINGLE PRODUCT -------- */
      .addCase(fetchProduct.pending, (s) => {
        s.loading = true;
        s.product = null;
      })
      .addCase(fetchProduct.fulfilled, (s, a) => {
        s.product = a.payload;
        s.loading = false;
      })
      .addCase(fetchProduct.rejected, (s) => {
        s.loading = false;
      })

      /* -------- AUTOCOMPLETE -------- */
      .addCase(autocomplete.fulfilled, (s, a) => {
        s.suggestions = a.payload;
      });
  },
});

export default productSlice.reducer;
