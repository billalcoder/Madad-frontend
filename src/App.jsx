import "./App.css";
import { useEffect, useState, createContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import BottomNav from "./components/BottomNav";
import OneSignalInit from "./components/OneSignalInit";
import OneSignal from 'react-onesignal';
import { onMessageListener, requestPermission, startper } from "../firebase";

const API_URL = import.meta.env;
console.log("API URL:", API_URL);
export const context = createContext();
const socket = io(import.meta.env.VITE_API_URL);
function App() {
  const url = "http://localhost:4000"
  const navigate = useNavigate()
  const [providerData, setProviderData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    startper(); // Ask permission and get token

    onMessageListener().then((payload) => {
      console.log("Message received in foreground:", payload);
      alert(payload.notification.title);
    });
  }, []);

  // ✅ Step 1: get user location
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

  // ✅ Step 2: fetch providers near user
  async function getProviderInfo(lat, lng) {
    try {
      const res = await fetch(
        `${url}/provider/nearprovider?lat=${lat}&lng=${lng}&maxDistance=10000`
        , {
          credentials: "include"
        });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        return navigate("/signup")
      }
      setProviderData(data.providers || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }

  // ✅ Step 3: call API when location is ready
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
            ? {
              ...p,
              location: { type: "Point", coordinates: [lng, lat] },
            }
            : p
        )
      );
    });

    return () => socket.off("provider_location_update");
  }, []);

  return (
    <context.Provider value={{ providerData, userLocation }}>
      <Outlet />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </context.Provider>
  );
}

export default App;
