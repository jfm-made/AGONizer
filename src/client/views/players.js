import React from 'react';
import axios from 'axios';
import {
    Row,
    Col,
    Input,
    InputNumber,
    Button,
    Divider,
    notification
} from 'antd';
import PlayersTable from '../components/playersTable';
import config from 'react-global-configuration';

const BASE_PATH = config.get('apiBase');

export default class Player extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        nickName: '',
        skillLevel: 5,
    };

    handlePlayerChange(event) {
        const key = event.target.id;

        this.setState({
            [key]: event.target.value,
        });
    };

    handlePlayerSkillChange(number) {
        if (!isNaN(number)) {
            this.setState({
                skillLevel: number,
            });
        }
    };

    async handleAddPlayer() {
        try {
            const player = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                nickName: this.state.nickName,
                skillLevel: this.state.skillLevel,
            };

            const result = await axios.post(`${BASE_PATH}player`, player);

            if (result && result.status === 200) {
                this.setState({
                    firstName: '',
                    lastName: '',
                    nickName: '',
                    skillLevel: 5,
                });

                notification.success({
                    message: 'Payer added',
                    description: 'The entry was successfully added to the payer database.',
                })
            } else {
                notification.error({
                    message: 'Unable to add player',
                    description: `ERROR: ${error.toString()}`,
                });
            }
        } catch (error) {
            console.log(error);
            notification.warn({
                message: 'Data is missing',
                description: 'Please fill all available fields to add a Player.',
            });
        }
    }

    render() {
        return (
            <div>
                <h2>Players</h2>
                <Row className="input-field-row">
                    <Col span={5}>
                        <Input
                            id="nickName"
                            addonBefore="Nick Name"
                            placeholder="Nickname"
                            value={this.state.nickName}
                            onChange={this.handlePlayerChange.bind(this)}
                        />
                    </Col>
                    <Col span={5}>
                        <Input
                            id="firstName"
                            addonBefore="First Name"
                            placeholder="First Name"
                            value={this.state.firstName}
                            onChange={this.handlePlayerChange.bind(this)}
                        />
                    </Col>
                    <Col span={5}>
                        <Input
                            id="lastName"
                            addonBefore="Last Name"
                            placeholder="Last Name"
                            value={this.state.lastName}
                            onChange={this.handlePlayerChange.bind(this)}
                        />
                    </Col>
                    <Col span={5}>
                        <InputNumber
                            min={1}
                            max={10}
                            defaultValue={5}
                            size="100%"
                            value={this.state.skillLevel}
                            onChange={this.handlePlayerSkillChange.bind(this)}
                            formatter={this.skillLevelFormatter}
                        />
                    </Col>
                    <Col span={4}>
                        <Button
                            type="primary"
                            icon="save"
                            block={true}
                            onClick={this.handleAddPlayer.bind(this)}
                        >
                            Add Player
                        </Button>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={24}>
                        <PlayersTable />
                    </Col>
                </Row>
            </div>
        );
    }

    skillLevelFormatter(value) {
        return `Skill Level: ${value.replace(/\D/gi, '')}`;
    }
}