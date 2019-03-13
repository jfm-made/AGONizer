import GlobalEmitter from '../util/globalEmitter';
import Player from '../models/player';

function attachPlayersWebSockets(webSocketServer) {

    async function answer(ws) {
        if (ws.readyState !== 1) {
            setTimeout(async () => {
                    await answer(ws);
                },
                100
            )
        } else {
            const players = await Player.find()
                .limit(100)
                .sort({
                    nickName: 1,
                });
            try {
                ws.send(JSON.stringify({players}));
            } catch (error) {
                console.log('WS ERROR', error);
            }
        }
    }

    webSocketServer.on('connection', function connection(ws) {
        ws.on('message', async (data) => {
            if (data === 'get-players') {
                await answer(ws);
            }
        });

        GlobalEmitter.on('players-update', async () => {
            await answer(ws);
        });
    });
}

export {
    attachPlayersWebSockets,
}
