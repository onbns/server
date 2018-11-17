import Auth from './controller';

const router = require('express').Router();
router.get('/', (req, res)=>res.send({message: 'connect to server.onbns.com/auth'}));

router.post('/signupWithEmail', Auth.signupWithEmail);
router.post('/verifyEmailToken', Auth.verifyEmailToken);
router.post('/signup/:token', Auth.signup);
router.post('/signin', Auth.signin);

export default router;