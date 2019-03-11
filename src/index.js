import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import socket from 'socket.io';
import Message from './model/message';
import Channel from './model/channel';

import config from './config';
import routes from './routes';

const LocalStrategy  = require('passport-local').Strategy;


const app = express();
app.server = http.createServer(app);
let io = socket(app.server);


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

/*||||||||||||||||SOCKET|||||||||||||||||||||||*/
//Listen for connection
var typingUsers = {};

io.on('connection', function(client) {
  console.log('a user connected');
  //Listens for a new chat message
  client.on('newChannel', function(name, description) {
    //Create channel
    let newChannel = new Channel({
    name: name,
    description: description,
  });
    //Save it to database
    newChannel.save(function(err, channel){
      //Send message to those connected in the room
      console.log('new channel created');
      io.emit("channelCreated", channel.name, channel.description, channel.id);
    });
  });

  //Listens for user typing.
  client.on("startType", function(userName, channelId){
    console.log("User " + userName + " is writing a message...");
    typingUsers[userName] = channelId;
    io.emit("userTypingUpdate", typingUsers, channelId);
  });

  client.on("stopType", function(userName){
    console.log("User " + userName + " has stopped writing a message...");
    delete typingUsers[userName];
    io.emit("userTypingUpdate", typingUsers);
  });

  //Listens for a new chat message
  client.on('newMessage', function(messageBody, userId, channelId, userName, userAvatar, userAvatarColor) {
    //Create message

    console.log(messageBody);

    let newMessage = new Message({
    messageBody: messageBody,
    userId: userId,
    channelId: channelId,
    userName: userName,
    userAvatar: userAvatar,
    userAvatarColor: userAvatarColor
  });
    //Save it to database
    newMessage.save(function(err, msg){
      //Send message to those connected in the room
      console.log('new message sent');

      io.emit("messageCreated",  msg.messageBody, msg.userId, msg.channelId, msg.userName, msg.userAvatar, msg.userAvatarColor, msg.id, msg.timeStamp);
    });
  });
});
/*||||||||||||||||||||END SOCKETS||||||||||||||||||*/

app.server.listen(config.port);
console.log(`Server started at port ${app.server.address().port}`);


module.exports = {
  app,
  io
}