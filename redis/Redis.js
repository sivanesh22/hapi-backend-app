const redis = require("redis");
const config = require('config')
const client = redis.createClient(config.get('redis.port'));

//data stored - userInfo , tinyurl and org url

const insertData = async (key, value, time = 300000) => {
    await client.setex(key, time, value);

}


const fetchData = (data) => {
    return new Promise(resolve => {
        client.get(data, (err, d) => {
            resolve(d)
        })
    })
}

const deleteData = async (data) => {
    await client.DEL(data)
}

module.exports = {
    insertData,
    fetchData,
    deleteData
}


