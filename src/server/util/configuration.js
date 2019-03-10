import config from 'config';
import debug from 'debug';

const log = debug('server:configuration');

function getMongoConfig() {
    try {
        // TODO Add auth config
        const host = config.get('mongo.host');
        const port = config.get('mongo.port');
        const database = config.get('mongo.database');
        const uri  = `mongodb://${host}:${port}/${database}`;

        return {
            host,
            port,
            database,
            uri,
        }
    } catch (error) {
        log('Mongo configuration missing. Required fields: host, port, database.');
        console.log(error);
        process.exit(0);
    }
}

function getExpressConfig() {
    try {
        const port = config.get('express.port');
        const root = config.get('express.root');

        return {
            port,
            root,
        }
    } catch (error) {
        log('Express configuration missing. Required fields: host, port.');
        console.log(error);
        process.exit(0);
    }
}

export {
    getExpressConfig,
    getMongoConfig,
}