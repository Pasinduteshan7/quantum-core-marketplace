'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user.name}!`);
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="card">
          <div className="card-content">
            <div className="text-center">
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Sign in to your Quantum Core account</p>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex-between">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#" className="link">Forgot password?</a>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="text-center switch-text">
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="link"
                >
                  Sign up
                </button>
              </p>
            </div>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="grid-2 mt-20">
              <button className="btn-outline" type="button">Google</button>
              <button className="btn-outline" type="button">Facebook</button>
            </div>
          </div>
        </div>

        <div className="text-center terms">
          <p>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
