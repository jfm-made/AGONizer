import React from 'react';
import {hot} from 'react-hot-loader/root';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Layout, Menu, Breadcrumb} from 'antd';
import "antd/dist/antd.css";
import Players from './views/players';
import Teams from './views/teams';
import Matches from './views/matches';
import './sass/main.sass';

const {Header, Content, Footer} = Layout;

function HeaderBar() {
    return (
        <Header>
            <span className="logoText">
                AGONizer
            </span>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{lineHeight: '64px'}}
            >
                <Menu.Item key="players">
                    <Link to="/">
                        Players
                    </Link>
                </Menu.Item>
                <Menu.Item key="teams">
                    <Link to="/teams">
                        Teams
                    </Link>
                </Menu.Item>
                <Menu.Item key="matches">
                    <Link to="/matches">
                        Matches
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
}

function FooterBar() {
    return (
        <Footer style={{textAlign: 'center'}}>
            AGONizer by JFM-made | <a href="mailto:agon@jfm-ma.de">agon@jfm-ma.de</a>
        </Footer>
    );
}

function App() {
    return (
        <Router>
            <Layout className="layout">
                { HeaderBar() }
                <Content>
                    <div className="content-main">
                        <Route path="/" exact component={Players}/>
                        <Route path="/teams/" component={Teams}/>
                        <Route path="/matches/" component={Matches}/>
                    </div>
                </Content>
                { FooterBar() }
            </Layout>
        </Router>
    )
}

export default hot(App)