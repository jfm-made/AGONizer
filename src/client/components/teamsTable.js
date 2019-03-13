import React from 'react';
import {
    notification,
    Table,
    Button,
    Popconfirm,
} from 'antd';
import config from 'react-global-configuration';
import axios from 'axios';

const API_PATH = config.get('apiBase');


export default class TeamsTable extends React.Component {

    constructor(props) {
        super(props);
    }

    renderPlayerCell = (index) => (players) => {
        if (players && typeof index === 'number' && players[index]) {
            const player = players[index];

            return (
                <span>
                    <strong>
                        {`${player.nickName}`}
                    </strong>
                    {` (${player.firstName} ${player.lastName})`}
                </span>
            )
        }

        return null;
    };

    render() {
        const columns = [{
            title: 'Team Name',
            dataIndex: 'name',
        }, {
            title: 'Skill',
            dataIndex: 'currentSkillLevelSum',
        }, {
            title: 'Player 1',
            dataIndex: 'players',
            key: '1',
            render: this.renderPlayerCell(0),
        }, {
            title: 'Player 2',
            dataIndex: 'players',
            key: '2',
            render: this.renderPlayerCell(1),
        }, {
            title: 'Player 3',
            dataIndex: 'players',
            key: '3',
            render: this.renderPlayerCell(2),
        }, {
            title: 'Player 4',
            dataIndex: 'players',
            key: '4',
            render: this.renderPlayerCell(3),
        }, {
            title: 'Player 5',
            dataIndex: 'players',
            key: '5',
            render: this.renderPlayerCell(4),
        }, {
            title: 'Delete',
            key: 'delete',
            render: (text, record) => {
                return (
                    <Popconfirm
                        placement="top"
                        title="Do you really want to delete this?"
                        onConfirm={this.deleteTeam(record)}
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
                dataSource={this.props.teams}
            />
        );
    }

    deleteTeam = (team) => async (event) => {
        const response = await axios.delete(`${API_PATH}team/${team.key}`);

        if (response && response.status === 200) {
            notification.success({
                message: 'Team deleted',
            })
        } else {
            notification.error({
                message: 'Unable to delete team',
            })
        }
    }

}