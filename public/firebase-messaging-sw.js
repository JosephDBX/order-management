importScripts("https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC7z4ymEA6fsGaPNMUsDuW0ChSXdnSi1r4",
  authDomain: "lcbm-nicaragua.firebaseapp.com",
  databaseURL: "https://lcbm-nicaragua.firebaseio.com",
  projectId: "lcbm-nicaragua",
  storageBucket: "lcbm-nicaragua.appspot.com",
  messagingSenderId: "698302161223",
  appId: "1:698302161223:web:30163af8246e378d05ec62",
  measurementId: "G-KWZSKGMCPE",
});

const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BFlaYpn1hgU8MwJ_woAPVuj885lu4rIonX4V795LMD-iFvkJhbLs_j2ecM2cTZGO92OItDlSOtOgB3z8ooSfqts"
);

messaging.setBackgroundMessageHandler((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    click_action: payload.data.click_action,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
