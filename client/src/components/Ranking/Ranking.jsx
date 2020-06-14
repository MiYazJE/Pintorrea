import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Avatar, Tooltip } from 'antd';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import './ranking.scss';
import { readUser } from '../../reducers/userReducer';

const { Content } = Layout;

const users = [
    { name: 'ruben', totalPoints: parseInt(Math.random() * 300) },
    { name: 'jose', totalPoints: parseInt(Math.random() * 300) },
    { name: 'pepe', totalPoints: parseInt(Math.random() * 300) },
    { name: 'juan', totalPoints: parseInt(Math.random() * 300) },
    { name: 'kevin', totalPoints: parseInt(Math.random() * 300) },
    { name: 'julio', totalPoints: parseInt(Math.random() * 300) },
    { name: 'julio', totalPoints: parseInt(Math.random() * 300) },
];

class Ranking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: [],
        };
    }

    componentDidMount() {
        console.log('mounting');
    }

    render() {
        return (
            <Layout className="layout">
                <Nav />
                <Content className="content">
                    <div className="wrapRanking">
                        <div className="ranking-table">
                            {users.map((user, index) => (
                                <div className="wrapUser">
                                    <span className="rank">#{index + 1}</span>
                                    <div className="avatar">
                                        <Avatar src={this.props.user.picture} size={80} />
                                    </div>
                                    <div className="stats">
                                        <div className="games">
                                            <span>
                                                Puntuación: <span className="totalPoints">{user.puntuation}</span>
                                            </span>
                                            <span>
                                                Partidas: <span className="totalGames">{` 20`}</span>
                                            </span>
                                        </div>
                                        <div className="victories">
                                            <div>
                                                <Tooltip title="Oro">
                                                    <span className="gold">🥇</span>
                                                </Tooltip>
                                                {parseInt(Math.random() * 10)}
                                            </div>
                                            <div>
                                                <Tooltip title="Plata">
                                                    <span className="silver">🥈</span>
                                                </Tooltip>
                                                {parseInt(Math.random() * 10)}
                                            </div>
                                            <div>
                                                <Tooltip title="Bronce">
                                                    <span className="bronze">🥉</span>
                                                </Tooltip>
                                                {parseInt(Math.random() * 10)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Content>
                <Footer />
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    user: readUser(state),
});

export default connect(mapStateToProps, {})(Ranking);
