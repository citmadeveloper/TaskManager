import React, { useContext, useState, useEffect, useRef } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (user && token) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token, role, name } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Show toast only once per login
        if (!toastShownRef.current) {
          toast.success(`Welcome back, ${name || "User"}!`);
          toastShownRef.current = true;
        }

        if (role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto px-4 h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h3>
        <p className="text-sm text-slate-700 mt-1 mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Arun@example.com"
              type="text"
            />
          </div>
          <div>
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium">{error}</p>
          )}

          <button
            className="btn-primary w-full py-2 md:py-2.5 text-sm md:text-base"
            type="submit"
          >
            LOGIN
          </button>

          <p className="text-sm text-slate-800 mt-3 text-center">
            Don't have an Account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
