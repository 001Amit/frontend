import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrdersAPI } from "./orderAPI";

export const fetchMyOrders = createAsyncThunk(
  "orders/my",
  async () => {
    const res = await getMyOrdersAPI();
    return res.data.orders; // ✅ ARRAY ONLY
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
