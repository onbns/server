import AWS from 'aws-sdk';
import User from './model';
import config from '../config';
import uuid from '../services/uuid';

export default {
  updateProfile: (req, res, next) => {
    req.user.comparedPassword(req.body.password, (err, good) => {
      if (err) return next(err);
      if (!good) return next('401:Incorrect Password');
      
      const userId = req.user._id;
      const newProfile = {
        name: {
          first: req.body.firstName,
          last: req.body.lastName
        },
        venmoId: req.body.venmoId || null
      };
      User.findByIdAndUpdate(userId, newProfile, { new: true })
      .then(newUser => res.sendStatus(200))
      .catch(next)
    })
  },

  updateProfileAvatar: (req, res, next) => {
    const file = req.file;
    const userId = req.user._id;
    if(!file) return next('500:image bad');
    const fieldname = file.fieldname;
    let filenameParts = file.originalname.split('.');
    let ext;
    if (filenameParts.length > 1) {
      ext = "." + filenameParts.pop();
    } else {
      ext = '';
    }

    const AWS_KEY_ID = config.aws.accessKeyId || process.env.AWSAccessKeyId;
    const AWS_SECRET = config.aws.secretKey || process.env.AWSSecretKey;

    const uuidKey = `${config.environment}/users/${userId}/${fieldname}/${uuid()}${ext}`;
    AWS.config.update({
      accessKeyId: AWS_KEY_ID,
      secretAccessKey: AWS_SECRET,
      subregion: 'us-west-1'
    });
    const s3 = new AWS.S3();
    s3.putObject({
      Bucket: 'onbns',
      Key: uuidKey, 
      Body: file.buffer,
      ACL: 'public-read'
    }, (err, result) => {
      if (err) return next('500:Uploading Photo Failed');
      const avatarURL = `https://s3-us-west-1.amazonaws.com/onbns/${uuidKey}`
      User.findByIdAndUpdate(userId, { $set:{avatar: avatarURL} }, { new: true })
      .then(_ => res.sendStatus(200))
      .catch(next)
    })
  }
}
