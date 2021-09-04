
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
// const { server } = require('../config/default.json');
const { tinyUrlLength } = require('../config/config');
const TinyUrlModal = require('../models/TinyUrl');
const dashboard = './screens/dashboard.html';


async function generateTinyURL(request, reply) {
    // const longUrl = 'https://www.netflix.com/';
    let longUrl = request.payload.longUrl;
    // const baseUrl = `${server.transferProtocol}:${server.host}:${server.port}`;
    // if (!validUrl.isUri(baseUrl)) {
    //     return res.status(401).json('Invalid base URL')
    // }
    const shortUrl = nanoid(tinyUrlLength)
    // const shortUrl = baseUrl + '/' + urlCode
    if (validUrl.isUri(longUrl)) {
        try {
            const url = await TinyUrlModal.findAll({
                attributes: ['tiny_url', 'original_url'],
                where: {
                    userId: 3,
                    originalUrl: longUrl
                }
            });
            if (url.length) {
                console.log('exists')
                // reply.redirect(url[0].dataValues.original_url)
            } else {
                await TinyUrlModal.create({
                    originalUrl: longUrl,
                    tinyUrl: shortUrl,
                    isActive: true,
                    userId: 3,
                    accountId: 1,
                    // expiryDate: '',
                    // createdAt: '',
                    // updatedAt: '',
                });
                console.log(shortUrl, 'shortUrl')
                reply.view(dashboard, {
                    username: 'Siva',
                    account_id: 1
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
    // reply.file(loginPath);
}


async function redirectTinyUrl(request, reply) {
    const { code } = request.params;
    try {
        const url = await TinyUrlModal.findAll({
            attributes: ['original_url'],
            where: {
                userId: 3,
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