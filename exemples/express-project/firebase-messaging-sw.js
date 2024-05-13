const notificationTitle = "Background Message Title";
const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
};

self.registration.sendNotification(notificationTitle, notificationOptions);
console.log("send");
