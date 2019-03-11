import express from 'express';
import initializeDb from '../db';
import user from '../controller/user';
import account from '../controller/account';
import config from '../config';
import middleware from '../middleware';

let router = express();

initializeDb(db =>{
     //internal middleware
    router.use(middleware({ config, db }));

    router.use('/user',user({config,db}));
    router.use('/account', account({ config, db }));

})

export default router;
