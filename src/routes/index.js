import express from 'express';
import initializeDb from '../db';
import user from '../controller/user';
import account from '../controller/account';
import channel from '../controller/channel';
import message from '../controller/message';
import config from '../config';
import middleware from '../middleware';

let router = express();

initializeDb(db =>{
     //internal middleware
    router.use(middleware({ config, db }));

     //api routes v1 (/v1)
    router.use('/user', user({ config, db }));
    router.use('/account', account({ config, db }));
    router.use('/channel', channel({ config, db }));
    router.use('/message', message({ config, db }));

})

export default router;
