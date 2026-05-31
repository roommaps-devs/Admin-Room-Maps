importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize Firebase inside the service worker context
firebase.initializeApp({
  apiKey: "AIzaSyAtq2UBHb_LxnMQ4P9DAykLYC3WYZ_GN6s",
  authDomain: "roommapes-949ff.firebaseapp.com",
  projectId: "roommapes-949ff",
  storageBucket: "roommapes-949ff.firebasestorage.app",
  messagingSenderId: "708004413195",
  appId: "1:708004413195:web:38b4437b347c5bba756c0e"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Room Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have an important update.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
