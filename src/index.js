import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import config from './config';
import routes from './routes'

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
    limit:10
}));

app.use('/v1', routes);

app.use('/',(req,res)=>{
    res.json('this chat is alive!')
});

app.server.listen(config.port);
console.log(`Server started at port ${app.server.address().port}`);