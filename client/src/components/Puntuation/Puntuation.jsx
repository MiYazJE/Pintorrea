import React, { Component } from 'react';
import { TiPencil } from 'react-icons/ti';
import FlipMove from 'react-flip-move';
import './puntuation.scss';
import UserAvatar from '../UsersAvatars/UserAvatar';
import { connect } from 'react-redux';
import { readUser } from '../../reducers/userReducer';
import { readDrawerName } from '../../reducers/gameReducer';

/**
 * It uses state components because FlipMove library seems to require it to work properly
 */

class Puntuation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };

        this.sortUsers = this.sortUsers.bind(this);
        this.updateGameStatus = this.updateGameStatus.bind(this);
    }

    componentDidMount = () => {
        const { socket, room } = this.props;

        socket.emit('getGameStatus', { room });
        socket.on('gameStatus', this.updateGameStatus);
    };

    componentWillUnmount = () => {
        console.log('PUNTUATION unmounting...');
        const { socket } = this.props;
        socket.off('gameStatus', this.updateGameStatus);
    };

    updateGameStatus = ({ users }) => {
        console.log(users);
        this.sortUsers(users);
    };

    sortUsers = (users) => {
        const sortDesc = (a, b) => b.puntuation - a.puntuation;
        this.setState({ users: users.sort(sortDesc) });
        console.log('sorting users');
    };

    render() {
        const { users } = this.state;
        const { drawerName } = this.props;
        const you = this.props.user.name;
        return (
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
                          <div key={user.name} className={`user ${user.guessed ? 'guessed' : ''}`}>
                              <span className="position">{`#${index + 1}`}</span>
                              {user.name === drawerName ? <TiPencil size={30} className="drawer" /> : null}
                              <div className="wrapNamePoints">
                                  <span className={`name ${you === user.name ? 'you' : ''}`}>
                                      {`${user.name}${user.name === you ? ' (Tú)' : ''}`}
                                  </span>
                                  <span>{user.puntuation} puntos</span>
                              </div>
                              <UserAvatar className="avatar" {...user} />
                          </div>
                      ))
                    : null}
            </FlipMove>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: readUser(state),
        drawerName: readDrawerName(state),
    };
};

export default connect(mapStateToProps, {})(Puntuation);
