import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import SearchBar from "../product/SearchBar";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          Daily<span className="text-yellow-300">Needs</span>
        </Link>

        {/* SEARCH BAR */}
        {(!isAuthenticated || user?.role === "customer") && (
          <div className="hidden md:flex flex-1 mx-6">
            <div className="w-full bg-white rounded-lg overflow-hidden">
              <SearchBar />
            </div>
          </div>
        )}

        {/* NAV LINKS */}
        <div className="flex items-center gap-4 text-sm">

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hover:bg-blue-700 px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* USER NAME */}
              <span className="hidden md:block">
                Hi, <span className="font-semibold">{user?.name}</span>
              </span>

              {/* CUSTOMER */}
              {user?.role === "customer" && (
                <>
                  <Link
                    to="/orders"
                    className="hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Orders
                  </Link>

                  <Link
                    to="/cart"
                    className="relative hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    🛒
                  </Link>
                </>
              )}

              {/* SELLER */}
              {user?.role === "seller" && (
                <Link
                  to="/seller/orders"
                  className="hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Dashboard
                </Link>
              )}

              {/* ADMIN */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Admin
                </Link>
              )}

              {/* LOGOUT */}
              <button
                onClick={logoutHandler}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {(!isAuthenticated || user?.role === "customer") && (
        <div className="md:hidden px-4 pb-2">
          <div className="bg-white rounded-lg overflow-hidden">
            <SearchBar />
          </div>
        </div>
      )}
    </header>
  );
}
