import React, { useState } from "react";
import axios from "axios";

export default function SellToCompany() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const submit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${import.meta.env.VITE_API_URL}/sellrequests`, {
        productTitle: title,
        description: desc,
        expectedPrice: price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Request sent");
      setTitle(""); setDesc(""); setPrice("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Sell to Company</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Product title" className="w-full mb-3 p-2 border rounded"/>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full mb-3 p-2 border rounded"/>
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Expected Price" className="w-full mb-3 p-2 border rounded"/>
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Submit</button>
    </form>
  );
}
