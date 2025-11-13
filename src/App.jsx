import "./App.css";
import { useEffect, useState, createContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import BottomNav from "./components/BottomNav";
import OneSignal from "react-onesignal";
import { onMessageListener, startper } from "../firebase";

export const context = createContext();
const socket = io(import.meta.env.VITE_API_URL);

function App() {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const [providerData, setProviderData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");

  // ✅ Define routes where bottom nav should be hidden
  const hideBottomNavRoutes = ["/login", "/signup"];
  const shouldHideBottomNav = hideBottomNavRoutes.includes(location.pathname);


  useEffect(() => {
    startper();
    onMessageListener().then((payload) => {
      console.log("Message received in foreground:", payload);
      alert(payload.notification.title);
    });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Geolocation denied:", err)
      );
    }
  }, []);

  async function getProviderInfo(lat, lng) {
    try {
      const res = await fetch(
        `${url}/provider/nearprovider?lat=${lat}&lng=${lng}&maxDistance=10000`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        return navigate("/signup");
      }
      setProviderData(data.providers || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }

  useEffect(() => {
    if (userLocation) {
      getProviderInfo(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  useEffect(() => {
    socket.on("provider_location_update", ({ providerId, lat, lng }) => {
      console.log("📍 Provider moved:", providerId, lat, lng);
      setProviderData((prev) =>
        prev.map((p) =>
          p._id === providerId
            ? { ...p, location: { type: "Point", coordinates: [lng, lat] } }
            : p
        )
      );
    });

    return () => socket.off("provider_location_update");
  }, []);

  return (
    <context.Provider value={{ providerData, userLocation }}>
      <Outlet />
      {/* ✅ Only show BottomNav when logged in AND not on login/signup */}
      {!shouldHideBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </context.Provider>
  );
}

export default App;
