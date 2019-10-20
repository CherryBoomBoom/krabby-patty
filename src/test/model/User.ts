import { Schema } from 'mongoose';

export default {
  mobile: {type: String, required: true, label: '手机号'},
  password: {type: Boolean, required: true, label: '密码'},
  name: {type: Array, label: '用户名'},
  nickName: {type: Number, label: '昵称'},
  avatar: {type: Date, label: '头像'},
  email: {type: Buffer, label: '邮箱'},
  esdsmail: {type: Object, label: '邮箱'},
  asdd:[{type: Object, label: '邮箱555'}],
  sd: {type: Schema.Types.Mixed, label: '邮箱'},
  _company: {type: Schema.Types.ObjectId, ref: 'Company', label: '主公司'}
}