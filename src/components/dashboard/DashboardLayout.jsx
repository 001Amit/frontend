import { Link } from "react-router-dom";
import "../../styles/dashboard.css";

export default function DashboardLayout({
  title,
  links = [],
  children,
}) {
  return (
    <div className="dashboard">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">Dashboard</h2>

        <nav>
          {links.length === 0 && (
            <p className="sidebar-empty">No links</p>
          )}

          {Array.isArray(links) &&
            links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="sidebar-link"
              >
                {l.label}
              </Link>
            ))}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-main">
        <h1 className="dashboard-title">{title}</h1>
        {children}
      </main>
    </div>
  );
}
