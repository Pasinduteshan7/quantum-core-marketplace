'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      toast.success(`Welcome to Quantum Core, ${res.user.name}!`);
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
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
              <h1 className="title">Create Account</h1>
              <p className="subtitle">Sign up for your Quantum Core account</p>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullname">Full Name</label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Kasun Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="text-center switch-text">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="link"
                >
                  Sign in
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

export default Register;
