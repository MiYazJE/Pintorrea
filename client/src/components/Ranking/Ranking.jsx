import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestRanking } from '../../actions/gameActions';
import { Layout, Avatar, Tooltip } from 'antd';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import './ranking.scss';
import { readUser } from '../../reducers/userReducer';
import io from 'socket.io-client';
import FlipMove from 'react-flip-move';

const { Content } = Layout;

let socket;

// const users = [
//     { name: 'ruben', totalPoints: parseInt(Math.random() * 300) },
//     { name: 'jose', totalPoints: parseInt(Math.random() * 300) },
//     { name: 'pepe', totalPoints: parseInt(Math.random() * 300) },
//     { name: 'juan', totalPoints: parseInt(Math.random() * 300) },
//     { name: 'kevin', totalPoints: parseInt(Math.random() * 300) },
//     { name: 'julio', totalPoints: parseInt(Math.random() * 300) },
//     { name: 'pedro', totalPoints: parseInt(Math.random() * 300) },
// ];

class Ranking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };

        this.sortUsers = this.sortUsers.bind(this);
    }

    componentDidMount() {
        socket = io.connect();
        this.props.requestRanking();

        socket.on('updateRanking', ({ ranking }) => {
            this.sortUsers(ranking);
        });
    }

    sortUsers = (users) => {
        console.log(users);
        const sortDesc = (a, b) => b.totalPoints - a.totalPoints;
        this.setState({ users: users.sort(sortDesc) });
        console.log('sorting users');
    };

    render() {
        const { users } = this.state;
        return (
            <Layout className="layout">
                <Nav />
                <Content className="content">
                    <div className="wrapRanking">
                        <div className="ranking-table">
                            <div className="title">
                                <h1>Temporada 2020/2021</h1>
                                <span>Ranking en directo</span>
                            </div>
                            <FlipMove
                                staggerDurationBy="30"
                                duration={500}
                                enterAnimation="accordionVertical"
                                leaveAnimation="accordionVertical"
                                typeName="div"
                                className="wrapUsers"
                            >
                                {users
                                    ? users.map((user, index) => (
                                          <div className="wrapUser" key={user._id}>
                                              <span className="rank">#{index + 1}</span>
                                              <div className="avatar">
                                                  <Avatar src={user.picture} size={60} />
                                                  <span className="name">{user.name}</span>
                                              </div>
                                              <div className="stats">
                                                  <div className="games">
                                                      <span>
                                                          Puntuación: <span className="totalPoints">{user.totalPoints}</span>
                                                      </span>
                                                      <span>
                                                          Partidas: <span className="totalGames">{user.totalGames}</span>
                                                      </span>
                                                  </div>
                                                  <div className="victories">
                                                      <div>
                                                          <Tooltip title="Oro">
                                                              <span className="gold">🥇</span>
                                                          </Tooltip>
                                                          {user.goldVictories}
                                                      </div>
                                                      <div>
                                                          <Tooltip title="Plata">
                                                              <span className="silver">🥈</span>
                                                          </Tooltip>
                                                          {user.silverVictories}
                                                      </div>
                                                      <div>
                                                          <Tooltip title="Bronce">
                                                              <span className="bronze">🥉</span>
                                                          </Tooltip>
                                                          {user.bronzeVictories}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      ))
                                    : null}
                            </FlipMove>
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

export default connect(mapStateToProps, { requestRanking })(Ranking);
