import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import User from '../model/user';

import { authenticate } from '../middleware/authMiddleware';

export default ({config,db}) =>{
    let api = Router();
    // '/v1/user/' - Read
    api.get('/', authenticate, (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
            res.status(500).json({ message: err });
            }
            res.status(200).json(users);
        });
    });

     // '/v1/user/add' - Create
    api.post('/add', authenticate, (req, res) => {
        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.avatarName = req.body.avatarName;
        newUser.avatarColor = req.body.avatarColor;

        newUser.save(err => {
        if (err) {
            res.status(500).json({ message: err });
        }
        res.status(200).json(newUser);
        });
    });

    return api;
}