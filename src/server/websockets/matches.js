import GlobalEmitter from '../util/globalEmitter';
import Matches from '../../client/views/matches';

function attachMatchesWebSockets(webSocketServer) {

    async function answer(ws) {
        if (ws.readyState !== 1) {
            setTimeout(async () => {
                    await answer(ws);
                },
                100
            )
        } else {
            const matches = await Matches.find()
                .limit(100)
                .populate('team1')
                .populate('team2')
                .populate('winner')
                .sort({
                    timeSlot: 1,
                });
            try {
                ws.send(JSON.stringify({matches}));
            } catch (error) {
                console.log('WS ERROR', error);
            }
        }
    }

    webSocketServer.on('connection', function connection(ws) {
        ws.on('message', async (data) => {
            if (data === 'get-matches') {
                await answer(ws);
            }
        });

        GlobalEmitter.on('matches-update', async () => {
            await answer(ws);
        });
    });
}

export {
    attachMatchesWebSockets,
}
