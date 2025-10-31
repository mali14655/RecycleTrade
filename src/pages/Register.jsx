// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("buyer"); // default role
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/register`,
//         {
//           name,
//           email,
//           password,
//           phone,
//           role,
//         },
//         { withCredentials: true }
//       );

//       localStorage.setItem("accessToken", res.data.accessToken);
//       nav("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.message || "Register error");
//     }
//   };

//   return (
//     <form className="max-w-md mx-auto" onSubmit={submit}>
//       <h2 className="text-xl font-semibold mb-4">Register</h2>

//       <input
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Name"
//         className="w-full mb-2 p-2 border rounded"
//         required
//       />
//       <input
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         type="email"
//         className="w-full mb-2 p-2 border rounded"
//         required
//       />
//       <input
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         type="password"
//         placeholder="Password"
//         className="w-full mb-2 p-2 border rounded"
//         required
//       />
//       {/* Role dropdown */}
//       <select
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//         className="w-full mb-2 p-2 border rounded"
//         required
//       >
//         <option value="buyer">Buyer</option>
//         <option value="seller_candidate">Seller (C2C)</option>
//         <option value="seller">Seller to Company</option>
//       </select>

//       {/* Phone only for sellers */}
//       {(role === "seller" || role === "seller_candidate") && (
//         <input
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           placeholder="Phone Number"
//           className="w-full mb-2 p-2 border rounded"
//         />
//       )}

//       <button className="bg-green-600 text-white px-4 py-2 rounded">
//         Register
//       </button>
//     </form>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="buyer">Buyer</option>
              <option value="seller_candidate">Seller (C2C)</option>
              <option value="seller">Seller to Company</option>
            </select>
          </div>

          {/* Phone only for sellers */}
          {(role === "seller" || role === "seller_candidate") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}