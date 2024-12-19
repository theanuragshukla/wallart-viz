const { Queue } = require('bullmq');
const {redisInstance:connection} = require('./connection')

const imgGenQueue = new Queue('img_gen', { connection, defaultJobOptions: {
  removeOnFail : true,
  removeOnComplete : true,
} });

module.exports = imgGenQueue;
