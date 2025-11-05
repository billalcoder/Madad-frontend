import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useContext } from "react";
import L from "leaflet";
import { context } from "../App";

export default function MapView({ providers }) {
  const { userLocation } = useContext(context);

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    iconSize: [35, 35],
  });

  const providerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
    iconSize: [35, 35],
  });

  const center = userLocation || { lat: 19.076, lng: 72.8777 };

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here 🧍‍♂️</Popup>
          </Marker>
        )}

        {/* Providers */}
        {providers?.map((p, i) => (
          <Marker
            key={p._id}
            position={[p.location.coordinates[1], p.location.coordinates[0]]}
            icon={providerIcon}
          >
            <Popup>
              <b>{p.name}</b>
              <br />
              {p.category}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
