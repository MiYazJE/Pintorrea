import React from 'react';
import UsersAvatars from '../UsersAvatars/UsersAvatars';
import { ToolOutlined, UserAddOutlined } from '@ant-design/icons';
import { Divider, Tooltip, Button } from 'antd';
import { connect } from 'react-redux';
import { readRooms } from '../../reducers/gameReducer';
import './rooms.scss';

const Room = ({ max, players, users, name, joinRoom }) => {
    const getColorState = (players, max) => {
        if (players === max) return 'red';
        if (players >= parseInt(max / 2)) return 'yellow';
        return 'green';
    };

    return (
        <div className="card-room">
            <div className="title">{name.toUpperCase()}</div>
            <div className="players" style={{ color: getColorState(players, max) }}>
                {players}/{max}
            </div>
            <UsersAvatars users={users} />
            <Tooltip placement="right" title={players === max ? 'La sala esta llena' : `Entrar a la sala '${name}'`}>
                <Button type="primary" disabled={max === players} onClick={() => joinRoom(name)}>
                    Entrar
                </Button>
            </Tooltip>
        </div>
    );
};

const Rooms = ({ rooms, joinRoom, setRedirect, createPrivateRoom, joinPrivateRoom }) => {
    return (
        <div className="containerRooms">
            <h1 className="title-rooms">Salas</h1>
            <Divider />
            <div className="wrap-rooms">
                {rooms.map((room) => (
                    <Room key={room.name} joinRoom={() => joinRoom(room.name)} {...room} />
                ))}
            </div>
            <div className="wrapBtn">
                <Button onClick={createPrivateRoom} className="btnCreatePrivate" icon={<ToolOutlined />}>
                    Crear sala privada
                </Button>
                <Button onClick={joinPrivateRoom} className="btnJoinPrivate" icon={<UserAddOutlined />}>
                    Entrar a una sala privada
                </Button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    rooms: readRooms(state)
});

export default connect(mapStateToProps, {})(Rooms);
