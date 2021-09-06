
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const { tinyUrlLength } = require('../config/config');
const TinyUrlModal = require('../models/TinyUrl');
const UserModal = require('../models/User');
const dashboard = './screens/dashboard.html';


async function generateTinyURL(request, reply) {
    const email = request.auth.credentials.email;
    const userObj= await UserModal.findOne({ attributes: ['id','accountId'], where: { email: email } })
    const userId=userObj.dataValues.id;
    const accountId=userObj.dataValues.accountId;
    let longUrl = request.payload.longUrl;
    const shortUrl = nanoid(tinyUrlLength)
    if (validUrl.isUri(longUrl)) {
        try {
            const url = await TinyUrlModal.findAll({
                attributes: ['tiny_url', 'original_url'],
                where: {
                    userId: userId,
                    originalUrl: longUrl
                }
            });
            if (url.length) {
                console.log('exists')
            } else {
                await TinyUrlModal.create({
                    originalUrl: longUrl,
                    tinyUrl: shortUrl,
                    isActive: true,
                    userId: userId,
                    accountId: accountId,
                    // expiryDate: '',
                    // createdAt: '',
                    // updatedAt: '',
                });
                reply.view(dashboard, {
                    username: 'Siva',
                    account_id: accountId
                })
            }
        }
        catch (err) {
            console.log(err)
            console.log('Server Error')
        }
    } else {
        console.log('Invalid longUrl')
    }
}


async function redirectTinyUrl(request, reply) {
    const { code } = request.params;
    const email = request.auth.credentials.email;
    const userObj= await UserModal.findOne({ attributes: ['id'], where: { email: email } })
    const userId=userObj.dataValues.id;
    try {
        const url = await TinyUrlModal.findAll({
            attributes: ['original_url'],
            where: {
                userId: userId,
                tinyUrl: code
            }
        });
        if (url.length) {
            reply.redirect(url[0].dataValues.original_url)
        } else {
            console.log('Invalid Url')
        }
    }
    catch (err) {
        console.log('Invalid Url')
    }
}

module.exports = {
    generateTinyURL, redirectTinyUrl
}