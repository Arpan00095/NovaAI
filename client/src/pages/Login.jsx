import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthContext";

import {
  loginUser,
  googleLogin,
} from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================
  // Email Login
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(
        form.email,
        form.password
      );

      login(data.user, data.token);

      toast.success("Login successful 🚀");

      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Google Login
  // ==========================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      const data = await googleLogin(
        credentialResponse.credential
      );

      login(data.user, data.token);

      toast.success(
        "Google Login Successful 🚀"
      );

      navigate("/");

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Google Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800"
      >

        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Login 🔐
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
          required
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* Divider */}

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-700" />

          <span className="text-slate-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* Google Login */}

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              toast.error(
                "Google Login Failed"
              )
            }
            theme="filled_black"
            shape="pill"
            size="large"
            text="signin_with"
          />
        </div>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-400"
          >
            Signup
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;