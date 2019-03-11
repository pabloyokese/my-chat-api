import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';

import config from './config';
import routes from './routes';

const LocalStrategy  = require('passport-local').Strategy;


const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
    limit:'100kb'
}));

//passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.use('/v1', routes);

app.use('/',(req,res)=>{
    res.json('this chat is alive!')
});

app.server.listen(config.port);
console.log(`Server started at port ${app.server.address().port}`);