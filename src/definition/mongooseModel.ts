import mongoose from "mongoose";
export default function mongooseModel(collectionName:string,model:{[key:string]:any}){
  let collectionConfig = {
    versionKey: false,
    timestamps: true,
    collection: collectionName
  }
  let mongoSchema = new mongoose.Schema(model, collectionConfig)
  // console.log(this.mongoose.model(collectionName, mongoSchema).find({}).then(w=>{console.log(w);}));
  return this.mongoose.model(collectionName, mongoSchema)
}