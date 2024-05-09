const notificationTitle = "Background Message Title";
const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
};

self.registration.showNotification(notificationTitle, notificationOptions);
console.log("send");
