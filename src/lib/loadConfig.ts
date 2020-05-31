import mongoose from 'mongoose'

export default class LoadConfig {
  public readonly module

  constructor(module) {
    this.module = module
    if (module.config.db) this.connectDatabase(module.config.db)
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
    Object.defineProperty(this.module, 'mongo', { value: db })
  }
}
