import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/triggers", label: "Live Triggers", icon: "⚡" },
    { to: "/claims", label: "My Claims", icon: "📋" },
    { to: "/chat", label: "AI Support", icon: "💬" },
    { to: "/admin", label: "Admin", icon: "🏢" },
  ];

  const signOut = () => {
    localStorage.removeItem("workerId");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🛡️ Gig<span>Shield</span>
      </div>
      <ul className="navbar-links">
        {links.map(l => (
          <li key={l.to}>
            <Link to={l.to} className={location.pathname === l.to ? "active" : ""}>
              {l.icon} {l.label}
            </Link>
          </li>
        ))}
        <li>
          <a href="#" className="signout" onClick={e => { e.preventDefault(); signOut(); }}>
            🚪 Sign Out
          </a>
        </li>
      </ul>
    </nav>
  );
}