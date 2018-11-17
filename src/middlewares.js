import config from './config';
import User from './user/model';
import { JWTService } from './services';

export function loginRequired(req, res, next){
  const h = req.header('Authorization');
  (!h)
  ?next('403:Please make sure your request has an Authorization header.')
  :JWTService.verifyToken(h, (err, payload) => {
    if (err) return next(`401:${err.message}`);
    User.findById(payload.sub)
    .then(user => {
      if (!user) return next('404:User not found!');
      req.user = user;
      next();
    })
    .catch(next)
  })
}
export function adminReuired({user}, res, next) {
  return (config.admin.list.includes(user.email)) ? next() : next('401:Admin Authorization Failed ')
}