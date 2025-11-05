import { useNavigate } from "react-router-dom";

export default function ProviderCard({ provider }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-4 cursor-pointer"
      onClick={() => navigate(`/provider/${provider._id}`)}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
      />
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-gray-800">{provider.name}</h3>
        <p className="text-gray-500 text-sm">{provider.title}</p>
        <div className="flex items-center text-yellow-500 text-sm mt-1">
          {"⭐".repeat(Math.round(provider.averageRating || 0))}
          <span className="ml-2 text-gray-600 text-xs">
            {provider.averageRating?.toFixed(1) || "0.0"} • {provider.distanceInKm} km
          </span>
        </div>
      </div>
    </div>
  );
}
