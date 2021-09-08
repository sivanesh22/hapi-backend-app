const Queue = require('bull');
const config = require('config')

const nodemailer = require('nodemailer');
// 1. Initiating the Queue

const sendMail = (toEmail,subject,message) => {
  const sendMailQueue = new Queue('sendMail', {
    redis: {
      host: config.get('redis.host'),
      port: config.get('redis.port'),
      password: ''
    }
  });
  const data = {
    toEmail: 'mostwanted04259@gmail.com',
    subject,
    message
  };

  const options = {
    delay: 600, // 1 min in ms
    attempts: 2
  };
  // 2. Adding a Job to the Queue
  sendMailQueue.add(data, options);

  // 3. Consumer
  sendMailQueue.process(async job => {

    return new Promise((resolve, reject) => {
      let mailOptions = {
        from: 'mageshravi902@gmail.com',
        to: toEmail,
        subject: subject,
        text: message,
      };
      let mailConfig = {
        service: 'gmail',
        auth: {
          user: 'mageshravi902@gmail.com',
          pass: 'm@geshr@vI902'
        }
      };
      nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  });
}
module.exports = {
  sendMail
}