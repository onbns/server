import AWS from 'aws-sdk';
import config from '../config';

const s3 = new AWS.S3();

const AWS_KEY_ID = config.aws.accessKeyId || process.env.AWSAccessKeyId;
const AWS_SECRET = config.aws.secretKey || process.env.AWSSecretKey;

AWS.config.update({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET,
  subregion: 'us-west-2'
});

export default s3;