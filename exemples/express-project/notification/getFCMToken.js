async function getfCMToken(userID) {
    try {
        const gettingDeviceToken = await UserModel.findByID({ _id: userID });
        let deviceToken = gettingDeviceToken.firebaseToken;
        if (deviceToken) {
            return deviceToken;
        } else {
            error("User's device token do not exist");
        }
    } catch (err) {
        error("Error during deviceToken grabbing", err);
        throw err;
    }
}
    