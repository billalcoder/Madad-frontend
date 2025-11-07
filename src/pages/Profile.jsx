import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false)
    const [message, setmessage] = useState()

    const navigate = useNavigate()
    const url = "http://localhost:4000"
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${url}/user/profile`, { credentials: "include" });
                const data = await res.json();
                setUser({ data });
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
        fetchUser();
    }, []);

  

    const handleClick = async (btnName) => {
        console.log(btnName);
        if (btnName === "Edit Profile") {
            // console.log(btnName.split(" ")[0]);
            navigate("/" + btnName.split(" ")[0])
        } else if (btnName === "Bookings History") {
            navigate("/" + btnName.split(" ")[0])
        } else if (btnName === "Help & Support") {
            navigate("/" + btnName.split(" ")[0])
        } else if (btnName === "Confirm") {
            try {
                const res = await fetch(`${url}/user/logout`, { method: "POST", credentials: "include" })
                const data = await res.json()
                console.log(data);
                setmessage(data)
                navigate("/signup")

            } catch (error) {
                console.log(error);
            }
        } else {
            setShowPopup(true)
        }
    };
    if (!user) return <p className="text-center mt-10">Loading...</p>;

    const userdata = user?.data?.user


    return (
        <div className="flex justify-center py-10 bg-gray-100 min-h-150">
            {showPopup ? <div className="bg-white blur-sm rounded-2xl shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                {/* Profile Section */}
                <h1 className="text-2xl font-bold">{userdata.name}</h1>
                <p className="text-gray-500 mb-5">{userdata.email}</p>

                <hr className="w-full border-gray-200 mb-5" />

                {/* Buttons Section */}
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => handleClick("Edit Profile")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        ✏️ Edit Profile
                    </button>

                    <button
                        onClick={() => handleClick("Bookings History")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        📅 Booking History
                    </button>

                    <button
                        onClick={() => handleClick("Help & Support")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        ❓ Help & Support
                    </button>
                    <button
                        onClick={() => handleClick("LogOut")}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        LogOut
                    </button>
                </div>
            </div> : <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                {/* Profile Section */}
                <h1 className="text-2xl font-bold">{userdata.name}</h1>
                <p className="text-gray-500 mb-5">{userdata.email}</p>

                <hr className="w-full border-gray-200 mb-5" />

                {/* Buttons Section */}
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => handleClick("Edit Profile")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        ✏️ Edit Profile
                    </button>

                    <button
                        onClick={() => handleClick("Bookings History")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        📅 Booking History
                    </button>

                    <button
                        onClick={() => handleClick("Help & Support")}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        ❓ Help & Support
                    </button>
                    <button
                        onClick={() => handleClick("LogOut")}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-full shadow-sm transition"
                    >
                        LogOut
                    </button>
                </div>
            </div>}
            {showPopup && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                        <h2 className="text-xl font-semibold mb-4">Confirm Booking?</h2>
                        <p className="text-gray-600 mb-6">
                            {!message ? `Sign out with this account ${userdata.name}?` : message.message}
                        </p>

                        <div className="flex justify-between space-x-4">
                            {!message && <button
                                onClick={() => {
                                    setShowPopup(false);
                                    { handleClick("Confirm") }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-1/2"
                            >
                                Confirm
                            </button>}
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-1/2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
