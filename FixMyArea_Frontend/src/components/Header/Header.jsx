import { useEffect, useRef, useState } from "react";
import Logo from "../../assets/images/Logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import "./Header.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Bind modal to root
Modal.setAppElement("#root");

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/reportissue", display: "Report Issue" },
  { path: "/contact", display: "Contact" },
];

// ================= MODAL FORM =================
const ModalForm = ({ type, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isLogin = type === "login";
  const title = isLogin ? "Login" : "Register";
  const buttonText = isLogin ? "Sign In" : "Sign Up";

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-lg shadow-lg p-6 w-[50%] md:w-[40%] mx-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
      >
        <IoClose size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {buttonText}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// ================= HEADER =================
const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const openModal = (type) => {
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  // Login/Register Handler
  const handleSubmit = async (data) => {
    try {
      const endpoint = modalType === "login" ? "/auth/login" : "/auth/register";

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Fetch user data after login
      const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);

      closeModal();

      const role = userRes.data.role;
      navigate(`/dashboard/${role}`);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/home");
  };

  return (
    <div className="headerr">
      <header className="header flex items-center" ref={headerRef}>
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="logoo">
              <img src={Logo} alt="logo" />
            </div>

            {/* Navigation */}
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu flex items-center gap-[2.7rem]">
                {navLinks.map((link, index) => (
                  <li key={index} className="group">
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `relative text-[15px] font-medium transition-colors duration-300
     ${isActive ? "text-blue-600" : "text-gray-900 hover:text-blue-500"}`
                      }
                    >
                      {link.display}

                      {/* underline */}
                      <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 
               transition-all duration-300 group-hover:w-full"
                      ></span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {!user && (
                <>
                  <button
                    onClick={() => openModal("login")}
                    className="bg-blue-500 text-white text-sm font-medium px-7 py-1.5 rounded-full hover:bg-blue-600 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openModal("register")}
                    className="bg-green-500 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-green-600 transition"
                  >
                    Register
                  </button>
                </>
              )}

              {user && (
                <div className="flex items-center gap-4 relative">
                  {/* Username */}
                  <span className="text-gray-700 text-sm font-medium">
                    Hello, {user.name}
                  </span>

                  {/* My Account Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-transparent border border-gray-300 text-sm font-medium px-4 py-1.5 rounded-full text-gray-800 hover:bg-gray-50 transition"
                  >
                    <span>My Account</span>
                    <span className="text-sm">👤</span>
                  </button>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-10 w-36 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden z-20">
                      <Link
                        to={`/dashboard/${user.role}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <span className="md:hidden" onClick={toggleMenu}>
                <BiMenu className="w-6 h-6 cursor-pointer" />
              </span>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="outline-none w-full flex justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center"
        >
          <ModalForm
            type={modalType}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        </Modal>
      </header>
    </div>
  );
};

export default Header;
