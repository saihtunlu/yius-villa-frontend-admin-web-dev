importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBnyV7E5HFgqiS2TD6CcEdve0XN7mPQwjM',
  authDomain: 'yiu-s-villa.firebaseapp.com',
  projectId: 'yiu-s-villa',
  storageBucket: 'yiu-s-villa.appspot.com',
  messagingSenderId: '143098488334',
  appId: '1:143098488334:web:4d3e192b893399a706fe5f',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    data: {
      // Store the URL in the notification data
      url: payload.data.url || '/',
    },
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification

  // Get the URL to open from the notification data
  const url = event.notification.data.url || '/'; // Default to home page if no URL is provided

  // Open the URL in the current tab or a new window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there is an open window with the same URL
      const client = clientList.find((client) => client.url === url && client.focus);
      if (client) {
        return client.focus(); // Focus the window if it matches
      } else {
        return clients.openWindow(url); // Otherwise, open a new window/tab
      }
    })
  );
});
