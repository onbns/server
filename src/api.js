import user from './user/router';
// import { loginRequired, adminReuired } from './middlewares';

const router = require('express').Router();

router.get('/', (req, res)=>res.json({ "message": "/api connected" }));

router.use('/user', user)

// router.use(`/admin`, loginRequired, adminReuired, admin);

export default router;