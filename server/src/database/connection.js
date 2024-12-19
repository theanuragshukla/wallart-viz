const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI

class ConnectMongo {
  _connect() {
    mongoose
      .connect(MONGO_URI)
      .then(() => {
      console.log(">>> Database connection successful");
      })
      .catch((err) => {
      console.error(">>> Database connection failed");
      console.error(err);
      });
  }
  constructor() {
    this._connect();
  }
}

module.exports = ConnectMongo;

