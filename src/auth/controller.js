import { EmailService, JWTService } from '../services';
import User from '../user/model';
import config from '../config';

export default {
  signupWithEmail: (req, res, next) => {
    const { email } = req.body;
    (!email)? next('500:You Must Provide Email.'):
    User.findOne({
      email: email
    }).then(user => {
      if (user) return next('403:Email is in use.');
      let { origin } = req.headers;
      const tokenn = JWTService.generateTokenWithEmail(email);
      origin = (origin)? origin + '/' : config.URIDomain;
      const deepLink = `${origin}#signupVerification?token=${tokenn}&address=${email}`;
      const mailObj = {
        to: email,
        subject: '[onbns]Blockchain Node Service Account Activation',
        message: (config.version=='public' || config.version=='internal')?activationEmailTemplate(deepLink):activationEmailTemplate(deepLink)
      };
      const isTesting = origin.includes('localhost') || config.version!=='public';
      if(isTesting){
        res.send({email, deepLink});
        return;
      }
      EmailService.send(mailObj).then(email=>{
        res.send({email});
      }).catch((err)=>{
        next('500:Email is bad.')
      });
    }).catch(next);
  },
  verifyEmailToken: (req, res, next) => {
    JWTService.verifyEmailToken(req.body.token, (err, address) => {
      if (err) return res.sendStatus(401);
      res.send(address);
    })
  },
  signup: (req, res, next) => {
    const { email, password, firstName, lastName, avatar } = req.body;
    JWTService.verifyEmailToken(req.params.token, (err, address) => {
      if (err || (address !== email) || (!email || !password)) return res.sendStatus(401);
      User
      .findOne({ email })
      .then(existingUser => {
        if (existingUser) return next('422:Email is in use');
        const newUser = new User({
          name: {
            first: firstName,
            last: lastName
          },
          email,
          password,
          avatar
        })
        
        newUser.save()
        .then(savedUser => {
          return res.send({
            token: JWTService.generateToken(savedUser), 
            isAdmin: (config.admin.list.indexOf(savedUser.email)!=-1),
            status: true
          })
        })
        .catch(next);
      })
      .catch(next);
    })
  },

  signin: (req, res, next) => {
    const { email, password } = req.body;
    (!email || !password)?next('You Must Provide Email And Password'):
      User.findOne({ email })
      .then(user => {
        if(!user)return next('404:User Is Not Found');
        user.comparedPassword(password, (err, good) => {
          (err || !good)?next(err || '403:Password Is Incorrect'):
          res.send({token: JWTService.generateToken(user), isAdmin: (config.admin.list.indexOf(user.email)!=-1)});
        })
      }).catch(next)
  }
}

// const accessRequestEmailTemplate = (deepLink) => {
//   return `<b>Welcome to onbns</b>
//   <br/>
//   You are in line to Beta Access!
//   <br/>
//   Please feel free to reply this email or reach out to us via team@onbns.com anytime.
//   <br/>
//   <br/>
//   Regards,
//   <br/>
//   <b>The onbns team</b>
//   `
// }

const activationEmailTemplate = (deepLink) => {
  return `<b>Welcome to onbns,</b>
  <br/>
  <br/>
  If you requested this activation, please go to the following URL to confirm this email and continue to use this email address as your account username,
  <br/>
  <br/>
  <a href='${deepLink}' target='_blank'>${deepLink}</a>
  <br/> 
  <br/> 
  We are looking forward to <b>your experience</b>. 
  <br/>
  Please feel free to reply this email or reach out to us via team@onbns.com anytime.
  <br/>
  <br/>
  <br/>
  Regards,
  <br/>
  <b>The onbns team</b>
  `
}