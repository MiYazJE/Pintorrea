import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import FlipMove from 'react-flip-move';
import './puntuation.scss';
import UserAvatar from '../UsersAvatars/UserAvatar';

/**
 * It uses state components because FlipMove library seems to require it to work properly
 */

class Puntuation extends Component {

    constructor(props) {
        super(props);
        this.sortUsers = this.sortUsers.bind(this);

        this.state = {
            users: []
        }

    }

    componentDidMount = () => {
        const { socket, room } = this.props;
        socket.on('gameStatus', ({ users }) => {
            this.sortUsers(users);
            console.log(users);
        });

        socket.emit('getGameStatus', { room });
    }

    sortUsers = (users) => {
        const sortDesc = (a, b) => b.puntuation - a.puntuation;
        this.setState({ users: users.sort(sortDesc) });
        console.log('sorting users');
    }

    render() {
        const { users } = this.state;
        return (
            <FlipMove
                staggerDurationBy="30"
                duration={500}
                enterAnimation="accordionVertical"
                leaveAnimation="accordionVertical"
                typeName="div"
                className="wrapUsers"
            >
                {
                    users ? users.map((user, index) => (
                        <div key={user.name} className="user">
                            <div className="userInfo">
                                <span>{`#${index + 1}`}</span>
                                <span>{user.name.toUpperCase()}</span>
                                <UserAvatar {...user} />
                            </div>
                            <span>{user.puntuation}</span>
                        </div>
                    )) : null}
            </FlipMove >
        );
    }

}

export default connect(null, {})(Puntuation);