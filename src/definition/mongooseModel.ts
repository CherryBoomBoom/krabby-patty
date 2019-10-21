export default function mongooseModel(collectionName:string,model:{[key:string]:any}){
  let collectionConfig = {
    versionKey: false,
    timestamps: true,
    collection: collectionName
  }
  let mongoSchema = new this.app.mongoose.Schema(model, collectionConfig)
  return this.mongoose.model(collectionName, mongoSchema)
}