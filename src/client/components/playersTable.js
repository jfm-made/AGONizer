import React from 'react';
import {
    notification,
    Table,
    Button,
    Popconfirm,
} from 'antd';
import config from 'react-global-configuration';
import WebSocket from 'isomorphic-ws';
import axios from 'axios';

const WS_PATH = config.get('wsBase');
const API_PATH = config.get('apiBase');


export default class PlayersTable extends React.Component {

    state = {
        players: [],
    };

    constructor(props) {
        super(props);

        this.initializeWebSockets();
    }

    initializeWebSockets() {
        const ws = this.ws = new WebSocket(WS_PATH);

        const setPlayers = (players) => {
            this.setState({
                players: players.map(player => {
                    player.key = player._id.toString();

                    return player;
                }),
            });
        };

        ws.onopen = () => {
            ws.send('get-players');
        };

        ws.onclose = () => {
            if (!this.unmounted) {
                notification.error({
                    message: 'Server connection problem',
                    description: 'Players table might not update changes. Please try to refresh the page.',
                });
            }
        };

        ws.onmessage = (messageEvent) => {
            if (messageEvent && messageEvent.data) {
                const obj = JSON.parse(messageEvent.data);
                setPlayers(obj.players);
            }
        };
    }

    componentWillUnmount() {
        this.unmounted = true;
        this.ws.close(1000, 'view changed');
    }

    componentDidMount() {}

    render() {
        const columns = [{
            title: 'Nick Name',
            dataIndex: 'nickName',
        }, {
            title: 'First Name',
            dataIndex: 'firstName',
        }, {
            title: 'Last Name',
            dataIndex: 'lastName',
        }, {
            title: 'Skill Level',
            dataIndex: 'skillLevel',
        }, {
            title: 'Delete',
            key: 'delete',
            render: (text, record) => {
                return (
                    <Popconfirm
                        placement="top"
                        title="Do you really want to delete this?"
                        onConfirm={this.deletePlayer(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            shape="circle"
                            icon="delete"
                        />
                    </Popconfirm>
                );
            }
        }];

        return (
            <Table
                columns={columns}
                dataSource={this.state.players}
            />
        );
    }

    deletePlayer = (player) => async (event) => {
        const response = await axios.delete(`${API_PATH}player/${player.key}`);

        if (response && response.status === 200) {
            notification.success({
                message: 'Player deleted',
            })
        } else {
            notification.error({
                message: 'Unable to delete player',
            })
        }
    }

}