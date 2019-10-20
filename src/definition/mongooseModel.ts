// import { Model, Schema, model, Document,SchemaType} from 'mongoose'


// let userSchema = {
//   mobile: {type: String, required: true, label: '手机号'},
//   password: {type: String, required: true, label: '密码'},
//   name: {type: String, label: '用户名'},
//   nickName: {type: String, label: '昵称'},
//   avatar: {type: String, label: '头像'},
//   email: {type: String, label: '邮箱'},
//   // _company: {type: ObjectId, ref: 'Company', label: '主公司'}
// }
// let s = new Schema(userSchema)
// let t:any = model('s', s)
// interface ss {
// 	ff:any
// }
// interface userDocument extends Document{
// 	mobile:string,
// 	password:string,
// 	name:string,
// 	nickName:string,
// 	avatar:string,
// 	email:string,
// }
// const mongooseModel: Model<userDocument> & ss = t

// mongooseModel.find().then(d =>{d[0].avatar})

export default (collectionName:string,model:{[key:string]:any},app:any)=>{
  let collectionConfig = {
    versionKey: false,
    timestamps: true,
    collection: collectionName
  }
  let mongoSchema = new app.mongoose.Schema(model, collectionConfig)
  return this.mongoose.model(collectionName, mongoSchema)
}