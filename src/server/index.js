import '@babel/polyfill';
import express from 'express';
import mongoose from 'mongoose';
import debug from 'debug';
import http from 'http';
import path from 'path';
import initializeWebSockets from './websockets';
import {
    getMongoConfig,
    getExpressConfig,
} from './util/configuration';
import router from './routes'
import { monitorModelCollection } from './util/mongoChangeListener';
import Player from './models/player';
import Team from './models/team';

const log = debug('server:index');

const mongoConfig = getMongoConfig();
mongoose.connect(mongoConfig.uri, {
    useCreateIndex: true,
    useNewUrlParser: true
});

// Express stuff to be moved to setup file
const expressConfig = getExpressConfig();

const expressApp = express();

expressApp.use(expressConfig.root, router);

expressApp.use(express.static(__dirname +'./../../build/'));

expressApp.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'./../client/index.html'));
});

const httpServer = http.createServer(expressApp);

initializeWebSockets(httpServer);

const expressServer = httpServer.listen(expressConfig.port);

expressServer.on('listening', () => {
    log(`Server is listening on port ${expressConfig.port} with base ${expressConfig.root}`);
});

monitorModelCollection(Player, () => {
    console.log('changed players');
});
monitorModelCollection(Team, () => {
    console.log('changed teams');
});
