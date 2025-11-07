// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBZco-j5IckcjiGgr9LRTmMsIlSGOmworw",
    authDomain: "madad-4d11f.firebaseapp.com",
    projectId: "madad-4d11f",
    storageBucket: "madad-4d11f.firebasestorage.app",
    messagingSenderId: "482042542511",
    appId: "1:482042542511:web:0859afc8326c46c3b8575a",
    measurementId: "G-Z8EJXS8R38"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
