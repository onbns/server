import {loginRequired} from './middlewares';
import apiRouter from './api';
import authRouter from './auth/router';

const router = require('express').Router();
router.get('/', (req, res)=>res.send({message: 'connect to server.onbns.com', webhook: 'https://server.onbns.com/ping', api: 'https://server.onbns.com/api'}));
router.get('/ping', (req, res)=>res.send({pong: new Date().toUTCString()}));

router.use('/auth', authRouter);
router.use('/api', loginRequired, apiRouter);

export default router;