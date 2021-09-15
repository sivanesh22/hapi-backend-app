
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const config = require('config')
const { tinyUrlLength } = require('../config/config');
const TinyUrlModal = require('../models/TinyUrl');
const redis = require('../redis/Redis')
const { sendMail } = require('../mailTrigger');
const { generateUserInfo } = require('../helpers/helpers');

async function generateTinyURL(request, reply) {
    const email = request.auth.credentials.email;
    let userInfo = await generateUserInfo(email);
    const userId = userInfo.id;
    const accountId = userInfo.accountId;
    let longUrl = request.payload.longUrl;
    //pass key as url+accountId+userId
    let shortUrl = nanoid(config.get('tokenData.tinyUrlLength'));
    if (validUrl.isUri(longUrl)) {
        try {
            const url = await TinyUrlModal.findOne({
                attributes: ['tiny_url', 'original_url'],
                where: {
                    userId: userId,
                    originalUrl: longUrl
                }
            });
            if (url) {
                reply({
                    newTinyurlCreated: false,
                    alreadyExists: true
                })
            } else {
                await redis.insertData(shortUrl, longUrl)
                await TinyUrlModal.create({
                    originalUrl: longUrl,
                    tinyUrl: shortUrl,
                    isActive: true,
                    userId: userId,
                    accountId: accountId,
                });
                reply({
                    newTinyurlCreated: true,
                    alreadyExists: false
                })
            }
        }
        catch (err) {
            console.log(err, 'error in generation tinyurl')
            reply({
                newTinyurlCreated: false,
                alreadyExists: false
            }).code(500);
        }
    } else {
        console.log('Invalid longUrl')
    }
}


async function redirectTinyUrl(request, reply) {
    const email = request.auth.credentials.email;
    const { code } = request.params;
    let originalUrl;
    try {
        originalUrl = await redis.fetchData(code);
        if (originalUrl) {
            reply.redirect(originalUrl)
        } else {
            let userInfo = await generateUserInfo(email);
            const userId = userInfo.id;
            const url = await TinyUrlModal.findOne({
                attributes: ['originalUrl'],
                where: {
                    userId: userId,
                    tinyUrl: code
                }
            });
            if (url) {
                reply.redirect(url.original_url)
            } else {
                console.log('Invalid Url')
            }
        }
    }
    catch (err) {
        reply({
            redirectionFailed: true,
        }).code(500);
    }
}


async function shareTinyUrlViaEmail(request, reply) {
    const { tinyUrl, originalUrl, emailList } = request.payload;
    const constructedShortUrl = `${config.get('server.transferProtocol')}${config.get('server.host')}:${config.get('server.port')}/${tinyUrl}`;
    const message = `Hi , as per you request ${constructedShortUrl} will be the tinyurl for ${originalUrl} `
    sendMail(emailList, 'New Tiny URL Generated', message)
    reply({
        success: true
    })
}


async function fetchAllUrl(request, reply) {
    const email = request.auth.credentials.email;
    try {
        let userInfo = await generateUserInfo(email);
        const userId = userInfo.id;
        let urlData = await TinyUrlModal.findAll({ attributes: ['originalUrl', 'tinyUrl'], where: { userId: userId, isActive: true } });
        let urlList = [];
        urlData.forEach((data) => {
            urlList.push(data.dataValues);
        });
        reply({
            urlList
        })
    } catch (err) {
        console.error(err, 'Error');
        reply({
            urlList,
            errorMsg:'Error in fetching url list'
        }).code(500);
    }
}

async function removeTinyUrl(request, reply) {
    const { tinyUrl } = request.payload;
    const email = request.auth.credentials.email;
    try {
        let userInfo = await generateUserInfo(email);
        const userId = userInfo.id;
        await TinyUrlModal.update({ isActive: false }, { where: { tinyUrl: tinyUrl }, individualHooks: true });
        let urlData = await TinyUrlModal.findAll({ attributes: ['originalUrl', 'tinyUrl'], where: { userId: userId, isActive: true } });
        let urlList = [];
        urlData.forEach((data) => {
            urlList.push(data.dataValues);
        });
        reply({
            urlList
        })
    } catch (err) {
        console.error(err, 'unable to update tinyurl');
        reply({
            urlList,
            errorMsg:'Error in removing url'
        }).code(500);
    }

}


module.exports = {
    generateTinyURL, redirectTinyUrl, fetchAllUrl, removeTinyUrl, shareTinyUrlViaEmail
}