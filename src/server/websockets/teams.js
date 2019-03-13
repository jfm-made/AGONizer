import GlobalEmitter from '../util/globalEmitter';
import Team from '../models/team';

function attachTeamsWebSockets(webSocketServer) {

    async function answer(ws) {
        if (ws.readyState !== 1) {
            setTimeout(async () => {
                    await answer(ws);
                },
                100
            )
        } else {
            const teams = await Team.find()
                .limit(100)
                .populate('players')
                .sort({
                    name: 1,
                });
            try {
                ws.send(JSON.stringify({teams}));
            } catch (error) {
                console.log('WS ERROR', error);
            }
        }
    }

    webSocketServer.on('connection', function connection(ws) {
        ws.on('message', async (data) => {
            if (data === 'get-teams') {
                await answer(ws);
            }
        });

        GlobalEmitter.on('teams-update', async () => {
            await answer(ws);
        });
    });
}

export {
    attachTeamsWebSockets,
}
