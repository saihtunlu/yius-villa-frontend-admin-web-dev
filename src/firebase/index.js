import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';
// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBnyV7E5HFgqiS2TD6CcEdve0XN7mPQwjM',
  authDomain: 'yiu-s-villa.firebaseapp.com',
  projectId: 'yiu-s-villa',
  storageBucket: 'yiu-s-villa.appspot.com', // Fix: `firebasestorage.app` should be `appspot.com`
  messagingSenderId: '143098488334',
  appId: '1:143098488334:web:4d3e192b893399a706fe5f',
  measurementId: 'G-W4TB8DG09R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export { app, analytics };

// Request Notification Permission and Get Token
export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BGqijY36ADvlaW26DftJXoxkG6upLzV9KcqViGgd_yE03LG7wpXpbQ1VXYG-OpyMN8IuUbnhkIELDfoxLi-4VgA',
    });
    if (token) {
      return token;
    }
    console.log('No registration token available. Request permission to generate one.');
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

// Listen for Incoming Messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      resolve(payload);
    });
  });

export const registerFBSW = () => {
  navigator.serviceWorker
    .register(`/firebase-messaging-sw.js`)
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => console.error('Service Worker registration failed:', error));
};
