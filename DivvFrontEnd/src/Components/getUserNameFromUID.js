const getUserNameFromUID = (UID, users) => {
    let userName = '';
    if (UID !== '') {
        users.forEach(user => {
            if (user.UserID === UID) {
                userName = user.Username;
                return;
            }
        });
    }
    return userName;
};

export default getUserNameFromUID;