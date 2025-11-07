import React, { useEffect, useState } from "react";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [resData, setResData] = useState(null);
  const url = "http://localhost:4000";

  // ✅ Fetch user on page load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${url}/user/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);

        if (data?.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ PUT request to update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);

    try {
      const res = await fetch(`${url}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response from server:", data);
      setResData(data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!user) {
    return <h1 className="text-center text-xl font-semibold py-10">Loading...</h1>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-5">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Save Changes
          </button>
        </form>

        {/* Optional response message */}
        {resData && (
          <p className="text-center text-green-600 mt-3">
            ✅ {resData.message || "Profile updated successfully!"}
          </p>
        )}
      </div>
    </div>
  );
}
