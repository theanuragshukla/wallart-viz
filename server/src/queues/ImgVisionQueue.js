const { Queue } = require('bullmq');
const {redisInstance:connection} = require('./connection')

const imgVisionQueue = new Queue('img_vision', { connection, defaultJobOptions: {
  removeOnFail: true,
  removeOnComplete: true,
} });

module.exports = imgVisionQueue;
