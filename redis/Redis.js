const redis = require("redis");
const config = require('config')
const client = redis.createClient(config.get('redis.port'));

const insertData = (key, value, time = 3000) => {
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


