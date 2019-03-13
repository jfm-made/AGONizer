import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import fallback from 'connect-history-api-fallback';
import debug from 'debug';
import express from 'express';
import path from 'path';
import webpackConfig from '../../../webpack.config';

const log = debug('server:clientMiddleware');
const compiler = webpack(webpackConfig);

const webpackMiddlewareOptions = {
    noInfo: true,
    logLevel: 'silent',
    stats: {
        colors: true
    },
    reporter(options, {
        state, stats,
    }) {
        if (state) {
            if (stats.hasErrors()) {
                log('Error while building client');
                log(stats.toString());
            } else if (stats.hasWarnings()) {
                log('Warning while building client');
                log(stats.toString());
            } else {
                log('Finished building client');
            }
        } else {
            log('Rebuilding client');
        }
    },
};



export default function (app) {
    app.use(fallback());

    if (process.env.NODE_ENV === 'development') {
        app.use(webpackDevMiddleware(compiler, webpackMiddlewareOptions));

        app.use(webpackHotMiddleware(compiler, {
            log,
            heartbeat: 5 * 1000,
        }));

    } else {
        app.use('/', express.static(path.resolve(__dirname, '../../client')));
    }
};