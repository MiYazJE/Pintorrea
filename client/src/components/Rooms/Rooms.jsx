import React from 'react';
import UsersAvatars from '../UsersAvatars/UsersAvatars';
import { Divider, Tooltip, Button } from 'antd';
import { connect } from 'react-redux';
import { joinRoom } from '../../Redux/Actions/UserActions';
import './rooms.scss';

const Room = ({ max, players, users, name, joinRoom }) => {

    const getColorState = (players, max) => {
        if (players === max) return 'red';
        if (players >= parseInt(max / 2)) return 'yellow'
        return 'green';
    }

    return (
        <div className="card-room" key={name}>
            <div className="title">{name.toUpperCase()}</div>
            <div className="players" style={{ color: getColorState(players, max) }}>{players}/{max}</div>
            <UsersAvatars users={users} />
            <Tooltip placement="right" title={players === max ? "La sala esta llena" : `Entrar a la sala '${name}'`}>
                <Button
                    type="primary"
                    disabled={max === players}
                    onClick={() => joinRoom(name)}
                >
                    Entrar
                </Button>
            </Tooltip>
        </div>
    );
}

const Rooms = ({ rooms, joinRoom, setRedirect }) => {

    const handleJoinRoom = (room) => {
        joinRoom(room);
        setRedirect(true);
    }

    return (
        <div className="containerRooms">
            <h1 className="title-rooms">Salas</h1>
            <Divider />
            <div className="wrap-rooms">
                {rooms.map((user) => <Room joinRoom={handleJoinRoom} {...user} />)}
            </div>
        </div>
    );

}

export default connect(null, { joinRoom })(Rooms);