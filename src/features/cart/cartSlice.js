import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  applyCouponAPI,
  addToCartAPI
} from "./cartAPI";

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await getCartAPI();
  return res.data;
});

export const updateItem = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }) => {
    const res = await updateCartItemAPI(id, quantity);
    return res.data;
  }
);

export const removeItem = createAsyncThunk(
  "cart/remove",
  async (id) => {
    const res = await removeCartItemAPI(id);
    return res.data;
  }
);

export const applyCoupon = createAsyncThunk(
  "cart/coupon",
  async (data, thunkAPI) => {
    try {
      const res = await applyCouponAPI(data);
      return res.data.discount;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    discount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCart.fulfilled, (s, a) => {
      s.cart = a.payload;
    });
    b.addCase(updateItem.fulfilled, (s, a) => {
      s.cart = a.payload;
    });
    b.addCase(removeItem.fulfilled, (s, a) => {
      s.cart = a.payload;
    });
    b.addCase(applyCoupon.fulfilled, (s, a) => {
      s.discount = a.payload;
    });


    
  },
});

export default cartSlice.reducer;
