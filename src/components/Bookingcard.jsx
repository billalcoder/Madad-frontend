import { useState, useEffect } from "react";
import { User, Tag, Package, Clock, Star, MessageSquare } from "lucide-react";

export default function BookingCard({ provider }) {
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [serverRatings, setServerRatings] = useState({});
  const [comment, setComment] = useState("");
  const url = import.meta.env.VITE_API_URL;

  function onChange(e) {
    setComment(e.target.value);
  }

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${url}/review`, { credentials: "include" });
        const data = await res.json();

        setReviews(data.reviews || []);
        const savedRatings = {};
        data.reviews?.forEach((r) => {
          savedRatings[r.bookingId] = { rating: r.rating, comment: r.comment };
        });
        setServerRatings(savedRatings);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();
  }, []);

  function handleRatingChange(e, id) {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = "";
    else if (value < 1) value = 1;
    else if (value > 5) value = 5;
    setRatings((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmitRating(bookingId, status, providerId, comment) {
    const rating = ratings[bookingId];
    if (!rating) {
      setMessage("Please enter a rating before submitting!");
      return;
    }

    try {
      const res = await fetch(`${url}/review`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookingId, status, rating, providerId, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        const refresh = await fetch(`${url}/review`, { credentials: "include" });
        const refreshed = await refresh.json();
        setReviews(refreshed.reviews);

        const savedRatings = {};
        refreshed.reviews.forEach((r) => {
          savedRatings[r.bookingId] = r.rating;
        });
        setRatings(savedRatings);

        setMessage("✅ Review submitted successfully!");
      } else {
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("❌ Something went wrong!");
    }
  }

  if (!provider || provider.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        <h1 className="text-xl font-semibold">No bookings found 😔</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {provider.map((item) => {
        const existingRating = serverRatings[item._id];

        return (
          <div
            key={item._id}
            className="bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 rounded-2xl shadow-2xl text-white backdrop-blur-md bg-opacity-90 p-6 transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/30 pb-3 mb-3">
              <div>
                <h3 className="font-bold text-xl mb-1 flex items-center gap-2">
                  <User size={18} /> {item?.providerId?.name}
                </h3>
                <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                  <Tag size={16} />{" "}
                  <span className="font-medium">
                    {item.providerId?.category?.toUpperCase()}
                  </span>
                </p>
                <p className="text-sm opacity-90 mb-1 flex items-center gap-2">
                  <Package size={16} /> Status: {item.status}
                </p>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <Clock size={16} />
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              <span
                className={`mt-3 md:mt-0 px-3 py-1 text-xs rounded-full font-semibold ${item.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            {/* Rating Section */}
            {item.status === "completed" && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-3">
                {serverRatings[item._id] ? (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold bg-white/20 px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                      <Star size={18} className="text-yellow-300" /> You rated:{" "}
                      <span className="text-yellow-300 font-bold">
                        {serverRatings[item._id]?.rating}
                      </span>
                      /5
                    </p>

                    {serverRatings[item._id]?.comment && (
                      <p className="text-sm font-semibold bg-white/20 px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                        <MessageSquare size={16} className="text-yellow-300" />
                        Your comment:{" "}
                        <span className="text-yellow-300 font-bold">
                          {serverRatings[item._id]?.comment}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <label className="text-sm flex items-center gap-2">
                      <Star size={16} /> Rate:
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={ratings[item._id] || ""}
                        onChange={(e) => handleRatingChange(e, item._id)}
                        className="w-16 rounded-md border border-white bg-white/20 text-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      />
                    </label>
                    <input
                      type="text"
                      value={comment}
                      onChange={onChange}
                      name="comment"
                      placeholder="Comment"
                      className="w-100 rounded-md border border-white bg-white/20 text-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />

                    <button
                      className="w-full md:w-40 bg-white text-blue-700 font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg hover:bg-blue-100 transition-all duration-200"
                      onClick={() =>
                        handleSubmitRating(
                          item._id,
                          item.status,
                          item.providerId._id,
                          comment
                        )
                      }
                    >
                      Submit Rating
                    </button>
                  </>
                )}
              </div>
            )}

            {message && (
              <p className="mt-3 text-sm text-yellow-200 font-medium italic">
                {message}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
