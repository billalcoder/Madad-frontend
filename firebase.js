// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const url = "http://localhost:4000"

const firebaseConfig = {
  apiKey: "AIzaSyBZco-j5IckcjiGgr9LRTmMsIlSGOmworw",
  authDomain: "madad-4d11f.firebaseapp.com",
  projectId: "madad-4d11f",
  storageBucket: "madad-4d11f.firebasestorage.app",
  messagingSenderId: "482042542511",
  appId: "1:482042542511:web:0859afc8326c46c3b8575a",
  measurementId: "G-Z8EJXS8R38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const startper = async () => {
  try {
    const permission = await Notification.requestPermission();
  } catch (error) {
console.log(error);
  }
}
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BHpZXr_b6JoBe4OZ5cPnlFrd4kDTmrwwcN5kCMgpnGNuRCXGPymMXHx9ZNyA6tyrpjYe1qI5kxLdgBzj1nvd1AQ",
      });
      console.log("FCM Token:", token);
      if (token) {
        const res = await fetch(`${url}/user/saveplayerid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ playerId: token }),
        });
        const data = await res.json()
        console.log(data);
      }
      return token;
    } else {
      console.log("Permission not granted for notifications");
    }
  } catch (error) {
    console.error("Error getting permission:", error);
  }
};


export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });