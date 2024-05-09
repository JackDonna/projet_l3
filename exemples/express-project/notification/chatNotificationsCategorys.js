const { TextMessage, images, documents, quatation } = require("notification/notificationTypes");

const chatNotificationsCategorys = {
    [TEXT_MESSAGE]: {
        type: "%Name%",
        template: "%messageData!",
        path: "/chatDetailScreen",
    },
    [IMAGES]: {
        type: "%Name%",
        template: "sent an image !",
        path: "/chatDetailScreen",
    },
    [DOCUMENTS]: {
        type: "%Name%",
        template: "sent a document !",
        path: "/chatDetailScreen",
    },
    [QUATATION]: {
        type: "%Name%",
        template: "sent a quatation !",
        path: "/chatDetailScreen",
    },
};

module.exports = {
    chatNotificationsCategorys,
};
