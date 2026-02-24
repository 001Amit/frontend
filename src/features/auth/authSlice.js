import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerAPI,
  verifyEmailAPI,
  loginAPI,
  logoutAPI,
  getMeAPI,
} from "./authAPI";

/* Register */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await registerAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

/* Verify OTP */
export const verifyEmail = createAsyncThunk(
  "auth/verify",
  async (data, thunkAPI) => {
    try {
      const res = await verifyEmailAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

/* Login */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await loginAPI(data);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

/* Logout */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await logoutAPI();
  }
);

/* Load user from cookie */
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async () => {
    try {
      const res = await getMeAPI();
      return res.data.user;
    } catch {
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    otpSent: false,
    isAuthenticated: false,
    authChecked: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* VERIFY OTP */
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.authChecked = true;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })

           /* LOAD USER */
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
        state.authChecked = true; // ✅ VERY IMPORTANT
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.authChecked = true; // ✅ EVEN ON FAIL
      });
  },
});

export default authSlice.reducer;
