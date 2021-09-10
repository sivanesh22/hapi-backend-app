const redis = require("redis");
const config = require('config')
const client = redis.createClient(config.get('redis.port'));

//data stored - userInfo , tinyurl and org url

const insertData = (key, value, time = 300000) => {
    client.setex(key, time, value);
    
}


const fetchData = (data) => {
    return new Promise(resolve => {
        client.get(data, (err, d) => {
            resolve(d)
        })
    })
}

const deleteData = (data) => {
    client.DEL(key)
}

module.exports = {
    insertData,
    fetchData,
    deleteData
}


