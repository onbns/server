import dotenv from 'dotenv';
import path from 'path';
if(process.env.NODE_ENV != 'production'){
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

export default {
  jwt_secret: process.env.JWT_SECRET || 'jwt_secrettt',
  jwt_secret_email: process.env.JWT_SECRET_EMAIL || 'jwt_secret_email',
  URIDomain: process.env.NODE_ENV == 'production' ? 'https://www.onbns.com/' : 'http://localhost:8080/',
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/onbns-testing'
  },
  sentryDSN: process.env.SentryDSN || '',
  admin: {
    list: ['andy@onbns.com', 'amazingandyyy@gmail.com', 'jojo@onbns.com']
  },
  aws: {
    accessKeyId: process.env.AWSAccessKeyId || '',
    secretKey: process.env.AWSSecretKey || ''
  },
  version: process.env.version || 'private',
  environment: process.env.NODE_ENV || 'development'
}