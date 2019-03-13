import ws from 'ws';
import { attachTeamsWebSockets } from './teams';
import { attachPlayersWebSockets } from './players';

export default function (expressServer) {
    const webSocketServer = new ws.Server({
        server: expressServer,
        path: '/sockets', // there is an s at the end for reasons!
    });

    attachTeamsWebSockets(webSocketServer);
    attachPlayersWebSockets(webSocketServer);
}