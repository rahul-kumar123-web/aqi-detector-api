import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isAdmin,
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          AQI Detector
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/compare">
            Compare
          </Link>

          {isAuthenticated && isAdmin && (
            <Link to="/admin">
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="user-name">
                {user?.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;