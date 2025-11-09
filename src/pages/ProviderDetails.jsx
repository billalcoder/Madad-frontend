import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, MapPin, Star, CheckCircle, XCircle } from "lucide-react"; // ✅ Lucide React icons

export default function ProviderDetails() {
    const { id } = useParams();
    const [provider, setProvider] = useState(null);
    const [category, setCategore] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [data, setdata] = useState();
    const [disable, setdisable] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const url = "https://madad-c0ci.onrender.com";
    console.log(provider);

    useEffect(() => {
        async function fetchProvider() {
            try {
                const res = await fetch(`${url}/provider/get/${id}`, { credentials: "include" });
                const data = await res.json();
                setProvider(data);
            } catch (error) {
                console.error("Error fetching provider details:", error);
            }
        }
        fetchProvider();
    }, [id]);

    useEffect(() => {
        async function fetchProvider() {
            try {
                const res = await fetch(`${url}/booking/user`, { credentials: "include" });
                const data = await res.json();
                setCategore(data);
            } catch (error) {
                console.error("Error fetching provider details:", error);
            }
        }
        fetchProvider();
    }, []);

    // ✅ Step 1: Check if user already booked a provider in this category
    const alreadyBookedSameCategory = category?.bookings?.some((b) => {
        return (
            b.providerId?.category === provider?.category &&
            b.status !== "cancelled" &&
            b.status !== "completed"
        );
    });

    console.log(alreadyBookedSameCategory);

    async function createBooking() {
        try {
            const res = await fetch(`${url}/booking`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ providerId: provider._id, status: "Requested" }),
            });

            const data = await res.json();
            setdata(data);

            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 5000);
        } catch (error) {
            console.error("Booking failed:", error);
        }
    }
    if (!provider) return <p className="text-center mt-10">Loading provider details...</p>;
    if (!category || !category.bookings) return <p className="text-center mt-10">Loading bookings...</p>;

    const providerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
        iconSize: [35, 35],
    });

    // if (!provider) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="flex justify-center py-10 bg-gray-100 min-h-screen relative">
            {showPopup || showSuccessModal ? (
                <div className="bg-white blur-sm rounded-2xl shadow-lg p-6 w-full max-w-md">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={
                                provider.image ||
                                "https://cdn-icons-png.flaticon.com/512/921/921071.png"
                            }
                            alt={provider.name}
                            className="w-28 h-28 rounded-full mb-3"
                        />
                        <h1 className="text-2xl font-bold">{provider.name}</h1>
                        <div className="flex items-center space-x-2 mt-1 text-yellow-500">
                            <Star size={18} fill="gold" stroke="gold" /> {/* ⭐ Icon */}
                            <span>{provider.averageRating}/5</span>
                        </div>
                        <p className="text-gray-600 mt-1">{provider.category}</p>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-4 text-gray-700">
                        <div className="flex items-center justify-center space-x-2">
                            <Phone size={18} className="text-blue-500" /> {/* 📞 */}
                            <span>{provider.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                            <MapPin size={18} className="text-red-500" /> {/* 📍 */}
                            <span>{provider.address || "Location not specified"}</span>
                        </div>
                    </div>

                    {/* Services Provided */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-left">
                            Services Provided
                        </h3>
                        <ul className="text-gray-600 list-disc list-inside space-y-1">
                            {provider.services?.length ? (
                                provider.services.map((srv, i) => <li key={i}>{srv}</li>)
                            ) : (
                                <li>No services listed</li>
                            )}
                        </ul>
                    </div>

                    {/* About Me */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-left">About Me</h3>
                        <p className="text-gray-600 text-sm">
                            {provider.description ||
                                "Experienced professional offering reliable and high-quality service."}
                        </p>
                    </div>

                    {/* Map Section */}
                    <div className="mt-6 w-full h-[250px] rounded-lg overflow-hidden shadow-md">
                        <MapContainer
                            center={[
                                provider.location.coordinates[1],
                                provider.location.coordinates[0],
                            ]}
                            zoom={14}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker
                                position={[
                                    provider.location.coordinates[1],
                                    provider.location.coordinates[0],
                                ]}
                                icon={providerIcon}
                            >
                                <Popup>{provider.name}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <p className="text-black-200 my-5">{data?.message}</p>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Book Now
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={
                                provider.image ||
                                "https://cdn-icons-png.flaticon.com/512/921/921071.png"
                            }
                            alt={provider.name}
                            className="w-28 h-28 rounded-full mb-3"
                        />
                        <h1 className="text-2xl font-bold">{provider.name}</h1>
                        <div className="flex items-center space-x-2 mt-1 text-yellow-500">
                            <Star size={18} fill="gold" stroke="gold" />
                            <span>{provider.averageRating}/5</span>
                        </div>
                        <p className="text-gray-600 mt-1">{provider.category}</p>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-4 text-gray-700">
                        <div className="flex items-center justify-center space-x-2">
                            <Phone size={18} className="text-blue-500" />
                            <span>{provider.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 mt-1">
                            <MapPin size={18} className="text-red-500" />
                            <span>{provider.address || "Location not specified"}</span>
                        </div>
                    </div>

                    {/* Services Provided */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-left">
                            Services Provided
                        </h3>
                        <ul className="text-gray-600 list-disc list-inside space-y-1">
                            {provider.services?.length ? (
                                provider.services.map((srv, i) => <li key={i}>{srv}</li>)
                            ) : (
                                <li>No services listed</li>
                            )}
                        </ul>
                    </div>

                    {/* About Me */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-left">About Me</h3>
                        <p className="text-gray-600 text-sm">
                            {provider.description ||
                                "Experienced professional offering reliable and high-quality service."}
                        </p>
                    </div>

                    {/* Map Section */}
                    <div className="mt-6 w-full h-[250px] rounded-lg overflow-hidden shadow-md">
                        <MapContainer
                            center={[
                                provider.location.coordinates[1],
                                provider.location.coordinates[0],
                            ]}
                            zoom={14}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker
                                position={[
                                    provider.location.coordinates[1],
                                    provider.location.coordinates[0],
                                ]}
                                icon={providerIcon}
                            >
                                <Popup>{provider.name}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Book Now Button */}
                    {alreadyBookedSameCategory ? (
                        <button
                            onClick={() => setShowPopup(true)}
                            disabled={true}
                            className="cursor-not-allowed mt-6 w-full bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
                        >
                            Booking already in progress
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowPopup(true)}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                        >
                            Book Now
                        </button>
                    )}

                </div>
            )}

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                        <h2 className="text-xl font-semibold mb-4">Confirm Booking?</h2>
                        <p className="text-gray-600 mb-6">
                            Do you want to confirm booking with <b>{provider.name}</b>?
                        </p>

                        <div className="flex justify-between space-x-4">
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    createBooking();
                                }}
                                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-1/2 gap-2"
                            >
                                <CheckCircle size={18} />
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-1/2 gap-2"
                            >
                                <XCircle size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-fade-in">
                        <h2 className="text-xl font-semibold text-green-600 mb-2">
                            Booking Status
                        </h2>
                        <p className="text-gray-700">
                            {data?.message || "Booking successful!"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
