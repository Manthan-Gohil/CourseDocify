// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 text-black flex justify-between shadow-md">
      <div className="text-2xl font-medium">
        <Link to="/">CourseDocify</Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <Link to="/upload" className="mr-4">Upload Files</Link>
            <button onClick={handleLogout} className="bg-[#060606] text-white px-3 py-1 rounded cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
