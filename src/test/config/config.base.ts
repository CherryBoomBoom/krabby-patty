import * as path from 'path'
export default {
  port: 3002,
	baseDir: path.join(__dirname, '..'),
	db: {
		url: 'mongodb://192.168.16.98:27017/abcde',
		options:{}
	}
}