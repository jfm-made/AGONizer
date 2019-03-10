import express from 'express';
import mongoose from 'mongoose';
import debug from 'debug';
import http from 'http';

const log = debug('server:index');

import {
    getMongoConfig,
    getExpressConfig,
} from './util/configuration';
import router from './routes'


const mongoConfig = getMongoConfig();
mongoose.connect(mongoConfig.uri, {
    useCreateIndex: true,
    useNewUrlParser: true
});



// Express stuff to be moved to setup file
const expressConfig = getExpressConfig();

const expressApp = express();

expressApp.use(expressConfig.root, router);

const httpsServer = http.createServer(expressApp);
const expressServer = httpsServer.listen(expressConfig.port);

expressServer.on('listening', () => {
    log(`Server is listening on port ${expressConfig.port} with base ${expressConfig.root}`);
});