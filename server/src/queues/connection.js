const Redis = require('ioredis');

class RedisSingleton {
  static instance = null;
  constructor() {
    if (!this.instance) {
      try {
        this.instance = this.newInstance();
      } catch (error) {
        console.log('>>> Failed to create Redis instance:', error.message);
      }
    }
  }

  newInstance() {
    const newInstance = new Redis( 'redis://localhost:6379', {
      maxRetriesPerRequest: null
    })

    newInstance.on('connect', () => {
      console.log('>>> Redis connected successfully');
    });

    newInstance.on('error', (error) => {
      console.log('>>> Redis connection error:', error.message);
    });

    return newInstance;

  }

  getInstance() {
    return this.instance;
  }

}

const redisSingleton = new RedisSingleton();
const redisInstance = redisSingleton.getInstance();
module.exports = { redisInstance, redisSingleton };

