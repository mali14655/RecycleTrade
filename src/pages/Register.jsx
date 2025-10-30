import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("buyer"); // default role
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name,
          email,
          password,
          phone,
          role,
        },
        { withCredentials: true }
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Register error");
    }
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={submit}>
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="w-full mb-2 p-2 border rounded"
        required
      />
      {/* Role dropdown */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      >
        <option value="buyer">Buyer</option>
        <option value="seller_candidate">Seller (C2C)</option>
        <option value="seller">Seller to Company</option>
      </select>

      {/* Phone only for sellers */}
      {(role === "seller" || role === "seller_candidate") && (
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full mb-2 p-2 border rounded"
        />
      )}

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}
