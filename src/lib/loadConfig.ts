import mongoose from 'mongoose'
import KrabbyPatty from '../interface/KrabbyPatty';

export default class LoadConfig {
  public app:KrabbyPatty

  constructor(app:KrabbyPatty) {
    this.app = app
    if (app.config.db) this.connectDatabase(app.config.db)
  }

  private connectDatabase(db) {
    if ('mongo' in db) return this.connectMongoDb(db['mongo'])
  }
  private connectMongoDb({ uri, options }) {
    options = options || { useNewUrlParser: true, useUnifiedTopology: true }
    mongoose.connect(uri, options)
    mongoose.Promise = global.Promise
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    Object.defineProperty(this.app, 'mongo', { value: db })
  }
}
