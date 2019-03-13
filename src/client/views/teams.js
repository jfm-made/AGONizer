import React from 'react';
import WebSocket from 'isomorphic-ws';
import {
    Button,
    notification,
    Row,
    Col,
    Select,
    Input,
    Divider,
} from 'antd';
import config from 'react-global-configuration';
import axios from 'axios';
import TeamsTable from '../components/teamsTable';

const WS_PATH = config.get('wsBase');
const BASE_PATH = config.get('apiBase');

export default class Team extends React.Component {

    state = {
        players: [],
        teams: [],
        totalNumberOfPlayers: 0,
        totalSkillLevelSum: 0,
        currentSkillLevelSum: 0,
        newTeamPlayers: [],
        blockedPlayers: [],
        teamName: '',
    };

    constructor(props) {
        super(props);

        this.initializeWebSockets();
    }

    // A nice stack of redundancy follows
    initializeWebSockets() {
        const ws = this.ws = new WebSocket(WS_PATH);

        const setPlayers = (players) => {
            this.setState({
                totalSkillLevelSum: players.map(x => x.skillLevel).reduce((a, b) => a+b, 0),
                players: players.map(player => {
                    player.key = player._id.toString();

                    return player;
                }),
                totalNumberOfPlayers: players.length,
            });
        };

        const setTeams = (teams) => {
            this.setState({
                teams: teams.map(team => {
                    team.key = team._id.toString();

                    return team;
                }),
                blockedPlayers: teams.map(x => x.players).reduce((a,b) => a.concat(b)).map(x => x._id),
            });
        };

        const unmounted = () => {
            if (!this.unmounted) {
                notification.error({
                    message: 'Server connection problem',
                    description: 'Players or Teams might not update changes. Please try to refresh the page.',
                });
            }
        };

        ws.onopen = () => {
            ws.send('get-players');
            ws.send('get-teams');
        };

        ws.onclose = unmounted;

        ws.onmessage = (messageEvent) => {
            if (messageEvent && messageEvent.data) {
                const obj = JSON.parse(messageEvent.data);
                const type = Object.keys(obj)[0];
                switch (type) {
                    case 'players':
                        return setPlayers(obj.players);
                    case 'teams':
                        return setTeams(obj.teams);
                }

            }
        };
    }

    componentWillUnmount() {
        this.unmounted = true;
        this.ws.close(1000, 'view changed');
    }

    renderSelectOptions() {
        return this.state.players
            .filter(x => {
                return !this.state.blockedPlayers.includes(x._id);
            })
            .map((player) => {
            return (
                <Option
                    key={player.key}
                    value={player.key}>
                    {`${player.firstName} ${player.lastName} - ${player.nickName} (${player.skillLevel})`}
                </Option>
            )
        })
    }

    handleTeamNameChange(event) {
        this.setState({
            teamName: event.target.value,
        });
    }

    async handleAddTeam() {
        try {
        const team = {
            name: this.state.teamName,
            players: this.state.newTeamPlayers
        };

        const result = await axios.post(`${BASE_PATH}team`, team);
            if (result && result.status === 200) {
                this.setState({
                    teamName: '',
                    newTeamPlayers: [],
                    currentSkillLevelSum: 0,
                });

                notification.success({
                    message: 'Team added',
                    description: 'The entry was successfully added to the team database.',
                })
            } else {
                notification.error({
                    message: 'Unable to add Team',
                    description: `ERROR: ${error.toString()}`,
                });
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Error adding Team',
                description: 'Please fill all available fields to add a Team.',
            });
        }
    }
    async handleGuessTeams() {}

    handleChangeSelect = (value) => {
        if (value.length <= 5) {
            this.setState({
                newTeamPlayers: value,
                currentSkillLevelSum: this.state.players.map(x => value.includes(x._id) ? x.skillLevel : 0).reduce((a, b) => a+b, 0),
            });
        }
    };

    render() {
        return (
            <div>
                <h2>Teams</h2>
                <Row className="input-field-row">
                    <Col span={5}>
                        <Input
                            value={this.state.teamName}
                            placeholder="Team Name"
                            onChange={this.handleTeamNameChange.bind(this)}
                        />
                    </Col>
                    <Col span={12}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={this.state.newTeamPlayers}
                            onChange={this.handleChangeSelect}
                        >
                            {this.renderSelectOptions()}
                        </Select>
                    </Col>
                    <Col span={1}>
                        <Input
                            value={`${this.state.currentSkillLevelSum}/${this.state.totalSkillLevelSum}`}
                            onChange={() => {}}
                        />
                    </Col>
                    <Col span={3}>
                        <Button
                            type="primary"
                            icon="save"
                            block={true}
                            disabled={this.state.newTeamPlayers.length !== 5 || this.state.teamName === ''}
                            onClick={this.handleAddTeam.bind(this)}
                        >
                            Add Team
                        </Button>
                    </Col>
                    <Col span={3}>
                        <Button
                            type="dashed"
                            icon="radar-chart"
                            block={true}
                            onClick={this.handleGuessTeams.bind(this)}
                        >
                            Autobalance
                        </Button>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <TeamsTable
                        teams={this.state.teams}
                    />
                </Row>
            </div>
        )
    }
}