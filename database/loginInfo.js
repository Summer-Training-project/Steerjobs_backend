const loginInfo  = (results) => {
    return {
        profileImage: '/assets/image/profile.svg',
        profileName: results[0].name,
        notification: 0
    }
}

module.exports = loginInfo;