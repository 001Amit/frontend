import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import SearchBar from "../product/SearchBar"; // 👈 IMPORT
import "../../styles/navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        
        {/* LOGO */}
        <Link to="/" className="logo">
          DailyNeeds
        </Link>

        {/* 🔎 SEARCH BAR (Only for customers or guest users) */}
        {( !isAuthenticated || user?.role === "customer") && (
          <div className="navbar-search">
            <SearchBar />
          </div>
        )}

        {/* NAV LINKS */}
        <div className="nav-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-user">Hi, {user?.name}</span>

              {/* Customer Links */}
              {user?.role === "customer" && (
                <>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/cart" className="cart">🛒</Link>
                </>
              )}

              {/* Seller Shortcut */}
              {user?.role === "seller" && (
                <Link to="/seller/orders">Seller Dashboard</Link>
              )}

              {/* Admin Shortcut */}
              {user?.role === "admin" && (
                <Link to="/admin">Admin</Link>
              )}

              <button onClick={logoutHandler} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
