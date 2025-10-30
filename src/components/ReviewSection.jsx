import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchReviews = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`, {
      rating,
      comment,
      name,
      email,
    });
    setRating("");
    setComment("");
    setName("");
    setEmail("");
    fetchReviews();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
          ))}
        </select>
        <textarea
          placeholder="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 w-full rounded"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </form>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={i} className="border p-3 rounded">
              <p className="font-semibold">{r.name || "Anonymous"}</p>
              <p className="text-yellow-500">{'⭐'.repeat(r.rating)}</p>
              <p>{r.comment}</p>
              <small className="text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
