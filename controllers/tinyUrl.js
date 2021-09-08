
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const config = require('config')
const { tinyUrlLength } = require('../config/config');
const TinyUrlModal = require('../models/TinyUrl');
const dashboard = './screens/dashboard.html';
const listUrl = './screens/listUrl.html';
const redis = require('../redis/Redis')
const { sendMail } = require('../mailTrigger')

async function generateTinyURL(request, reply) {
    let userId;
    let accountId;
    let username;
    try {
        userId = await redis.fetchData('userId');
        accountId = await redis.fetchData('accountId');
        username = await redis.fetchData('username');
    } catch (err) {
        console.error(err, 'Error in fetching data from redis');
    }
    let longUrl = request.payload.longUrl;
    let shortUrl = nanoid(tinyUrlLength);
    var isUniqueShortUrl = false;
    while (!isUniqueShortUrl) {
        try {
            const url = await TinyUrlModal.findAll({
                attributes: ['tiny_url', 'original_url'],
                where: {
                    tinyUrl: shortUrl,
                }
            });
            if (url.length) {
                shortUrl = nanoid(tinyUrlLength);
            } else {
                isUniqueShortUrl = true;
            }
        }
        catch (err) {
            console.log(err)
            console.log('unable to fetch data from TinyUrlModal')
        }
    }
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
                redis.insertData(shortUrl, longUrl)
                const constructedShortUrl = `${config.get('server.transferProtocol')}${config.get('server.host')}:${config.get('server.port')}/${shortUrl}`;
                const message = `Hi ${username} , as per you request ${constructedShortUrl} will be the tinyurl for ${longUrl} `
                sendMail('mostwanted04259@gmail.com', 'New Tiny URL Generated', message)
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
                    username: username,
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
    let originalUrl;
    try {
        originalUrl = await redis.fetchData(code);
    } catch (err) {
        console.error(err, 'Error in fetching redis details');
    }
    if (originalUrl) {
        reply.redirect(originalUrl)
    } else {
        let userId;
        try {
            userId = await redis.fetchData('userId');
        } catch (err) {
            console.error(err, 'Error in fetching user details');
        }
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
}



async function fetchAllUrl(request, reply) {
    const email = request.auth.credentials.email;
    let userId;
    try {
        userId = await redis.fetchData('userId');
    } catch (err) {
        console.error(err, 'Error in fetching user details');
    }
    try {
        let urlData = await TinyUrlModal.findAll({ attributes: ['originalUrl', 'tinyUrl'], where: { userId: userId, isActive: true } });
        let urlList = [];
        urlData.forEach((data) => {
            urlList.push(data.dataValues);
        });
        reply.view(listUrl, {
            urlList
        })
    } catch (err) {
        console.error(err, 'Error');
    }
}

async function removeTinyUrl(request, reply) {
    const { tinyUrl } = request.payload;
    let userId;
    try {
        userId = await redis.fetchData('userId');
    } catch (err) {
        console.error(err, 'Error in fetching user details');
    }
    try {
        await TinyUrlModal.update({ isActive: false }, { where: { tinyUrl: tinyUrl }, individualHooks: true });
    } catch (err) {
        console.error(err, 'unable to update tinyurl');
    }
    let urlData = await TinyUrlModal.findAll({ attributes: ['originalUrl', 'tinyUrl'], where: { userId: userId, isActive: true } });
    let urlList = [];
    urlData.forEach((data) => {
        urlList.push(data.dataValues);
    });
    reply.view(listUrl, {
        urlList
    })
}


module.exports = {
    generateTinyURL, redirectTinyUrl, fetchAllUrl, removeTinyUrl
}