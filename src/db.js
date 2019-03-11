import mongoose from 'mongoose';
import config from './config';

export default callback =>{
    let db;
    mongoose.connect(config.mongoUrl,(err,database)=>{
        if(err) {
            console.log(err);
            process.exit(1);
        }

        console.log(config.mongoUrl);
        db = database;
        console.log("Database connection ready ");
        callback(db);
    })
}