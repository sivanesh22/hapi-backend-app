const userRoleName = 'User';
const adminRoleName = 'Admin';
const accountOwnerRoleName = 'Account Owner';
const cookie_options = {
    ttl: 1 * 24 * 60 * 60 * 1000, // expires after a day
    encoding: 'none',
    isSecure: true,
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true,
    isSameSite: false,
    path: '/',
}

module.exports = {
    userRoleName,
    cookie_options,
    adminRoleName,
    accountOwnerRoleName
}
