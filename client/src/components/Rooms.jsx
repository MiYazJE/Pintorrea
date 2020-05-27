import React from 'react';
import { Divider, Avatar, Tooltip, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { joinRoom } from '../Redux/Actions/UserActions';

const Rooms = ({ rooms, joinRoom, setRedirect }) => {

    const handleJoinRoom = (room) => {
        joinRoom(room);
        setRedirect(true);
    }

    const handleViewProfile = (name, id) => {
        console.log(`opening ${name}'s profile...`);
    }

    const getColorState = (players, max) => {
        if (players === max) return 'red';
        if (players >= parseInt(max / 2)) return 'yellow'
        return 'green';
    }

    return (
        <div className="containerRooms">
            <h1 className="title-rooms">Salas</h1>
            <Divider />
            <div className="wrap-rooms">
                {rooms ? rooms.map(({ name, players, max, users, started }) => (
                    <div className="card-room" key={name}>
                        <div className="title">{name.toUpperCase()}</div>
                        <div className="players" style={{ color: getColorState(players, max) }}>{players}/{max}</div>
                        <div className="users-profiles">
                            {users.map((user, index) => (
                                user ?
                                    <Tooltip key={user.id} placement="top" title={user.name}>
                                        <Avatar
                                            style={{ cursor: 'pointer' }}
                                            src={user.picture}
                                            onClick={() => handleViewProfile(user.name, user.id)}
                                        />
                                    </Tooltip>
                                    : <Avatar key={index} icon={<UserOutlined />} />
                            ))}
                        </div>
                        <Tooltip placement="right" title={players === max ? "La sala esta llena" : `Entrar a la sala '${name}'`}>
                            <Button
                                type="primary"
                                disabled={max === players}
                                onClick={() => handleJoinRoom(name)}
                            >
                                Entrar
                            </Button>
                        </Tooltip>
                    </div>
                )) : (<div>No rooms</div>)}
            </div>
        </div>
    );

}

export default connect(null, { joinRoom })(Rooms);