import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, authChecked } = useSelector(
    (s) => s.auth
  );

  // ⏳ Wait until auth check completes
  if (!authChecked) {
    return <p className="p-6">Checking authentication...</p>;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}
