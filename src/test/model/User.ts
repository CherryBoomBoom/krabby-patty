export default {
  mobile: {type: String, required: true, label: '手机号'},
  password: {type: String, required: true, label: '密码'},
  name: {type: String, label: '用户名'},
  nickName: {type: String, label: '昵称'},
  avatar: {type: String, label: '头像'},
  email: {type: String, label: '邮箱'},
  // _company: {type: ObjectId, ref: 'Company', label: '主公司'}
}