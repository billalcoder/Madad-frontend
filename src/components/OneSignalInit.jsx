// src/components/OneSignalInit.jsx
import OneSignal from 'react-onesignal';

export default async function OneSignalInit() {

    const url = "http://localhost:4000"
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    await OneSignal.init({
        appId: "19446a03-690a-4ff1-a3b4-9aeb313da54e",
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: true },
        serviceWorkerPath: "../public/OneSignalSDKWorker.js",
        serviceWorkerParam: { scope: "../public/onesignal/js/" },
    });

    console.log("✅ OneSignal Initialized");

    // Request permission AFTER init
    const permission = await OneSignal.Notifications.requestPermission();

    if (permission !== 'granted') {
        // console.log("✅ Notifications allowed!");
        // await OneSignal.login("user_001");
        // await OneSignal.User.addTag("type", "provider");
        await OneSignal.Notifications.requestPermission();

        const playerId = await OneSignal.User.PushSubscription.id;
        if (playerId) {
            const res = await fetch(`${url}/user/saveplayerid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ playerId }),
            });
            const data = await res.json()
            console.log(data);
        }

        console.log("🎯 Player ID:", playerId);
    } else {
        console.warn("❌ Notifications denied by user");
    }
}
