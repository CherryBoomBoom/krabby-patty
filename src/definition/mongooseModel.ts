import mongoose from "mongoose";
export default function mongooseModel(collectionName:string,model:{[key:string]:any}){
  if(!this.mongo)return
  let collectionConfig = {
    versionKey: false,
    timestamps: true,
    collection: collectionName
  }
  let mongoSchema = new mongoose.Schema(model, collectionConfig)
  return this.mongo.model(collectionName, mongoSchema)
}