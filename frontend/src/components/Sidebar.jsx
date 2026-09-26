import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="rail">
      <div className="rail-mark">SINEW</div>
      <nav className="rail-nav">
        <NavLink to="/" end className={({ isActive }) => `rail-link ${isActive ? "is-active" : ""}`}>
          Dashboard
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => `rail-link ${isActive ? "is-active" : ""}`}>
          Goals
        </NavLink>
      </nav>
      <div className="rail-user">
        <div className="rail-user-name">{user?.name}</div>
        <div className="rail-user-email">{user?.email}</div>
      </div>
      <button className="btn-ghost" onClick={logout}>
        Log out
      </button>
    </aside>
  );
}
