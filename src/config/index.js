export default {
  port: 3000,
  // "mongoUrl": "mongodb://localhost:27017/chat-api",
  mongoUrl: 'mongodb://admin:abc123@ds211096.mlab.com:11096/mychat',
//   "port": process.env.PORT,
//   mongoUrl: process.env.MONGODB_URI,
  bodyLimit: '100kb'
}