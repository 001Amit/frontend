import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";

import MyOrders from "./pages/customer/MyOrders";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProductForm from "./pages/seller/SellerProductForm";
import SellerEarnings from "./pages/seller/SellerEarnings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./features/auth/authSlice";
import { ToastContainer } from "react-toastify";
import AdminSellerOrders from "./pages/admin/AdminSellerOrders";
import AdminSellerOrderDetails from "./pages/admin/AdminSellerOrderDetails";
import "react-toastify/dist/ReactToastify.css";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMonthlyRevenue from "./pages/admin/AdminMonthlyRevenue";
import AdminSellerRevenue from "./pages/admin/AdminSellerRevenue";
import AdminSettlements from "./pages/admin/AdminSettlements";
import AdminSettlementHistory from "./pages/admin/AdminSettlementHistory";


export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  },
  [dispatch]);
  return (
    <BrowserRouter>
      <Navbar />
<ToastContainer position="top-right" autoClose={1500} />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["customer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={["customer"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["customer"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute roles={["seller"]}>
                <SellerOrders />
              </ProtectedRoute>
            }
          />
          <Route
          path="/seller/products/new"
          element={<SellerProductForm />}
          />

          <Route
          path="/seller/products/edit/:id"
          element={<SellerProductForm />}
          />
          <Route
          path="/seller/products"
          element={
          <ProtectedRoute roles={["seller"]}>
            <SellerProducts />
            </ProtectedRoute>
          }
          />

          <Route
          path="/seller/earnings"
          element={
          <ProtectedRoute roles={["seller"]}>
            <SellerEarnings />
            </ProtectedRoute>
          }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
          path="/admin/users"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUsers />
            </ProtectedRoute>
          }
          />
          <Route
          path="/admin/seller-orders"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminSellerOrders />
            </ProtectedRoute>
          }
          />
          <Route
          path="/admin/seller-orders/:sellerId"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminSellerOrderDetails />
            </ProtectedRoute>
          }
          />
          <Route
          path="/admin/categories"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminCategories />
            </ProtectedRoute>
          }
          />
          <Route
          path="/admin/orders"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminOrders />
            </ProtectedRoute>
          }
          />
          <Route
          path="/admin/revenue/sellers"
          element={
          <ProtectedRoute roles={["admin"]}>
          <AdminSellerRevenue />
          </ProtectedRoute>
          }
          />
          <Route
          path="/admin/revenue/monthly"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminMonthlyRevenue />
            </ProtectedRoute>
            }
          />
          <Route
          path="/admin/settlements"
          element={
          <ProtectedRoute roles={["admin"]}>
            <AdminSettlements />
            </ProtectedRoute>
          }
          />
          <Route
  path="/admin/settlements/history"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminSettlementHistory />
    </ProtectedRoute>
  }
/>


      </Routes>
    </main>
  <Footer />
  </BrowserRouter>
  );
}
