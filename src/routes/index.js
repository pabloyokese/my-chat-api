import express from 'express';
import initializeDb from '../db';

let router = express();

initializeDb(db =>{
    router.use('/user',(req,res)=>{});
})

export default router;
