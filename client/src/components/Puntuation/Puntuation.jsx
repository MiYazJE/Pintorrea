import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { TiPencil } from 'react-icons/ti';
import FlipMove from 'react-flip-move';
import './puntuation.scss';
import UserAvatar from '../UsersAvatars/UserAvatar';
import { connect } from 'react-redux';
import { readUser } from '../../reducers/userReducer';
import { readDrawerName } from '../../reducers/gameReducer';

const Puntuation = ({ drawerName, user, puntuationRef }) => {
    const [users, setUsers] = useState([]);

    useImperativeHandle(puntuationRef, () => ({
        sortUsers
    }));

    const sortUsers = (users) => {
        const sortDesc = (a, b) => b.puntuation - a.puntuation;
        setUsers(users.sort(sortDesc));
    };

    const you = user.name;
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
};

const mapStateToProps = (state) => {
    return {
        user: readUser(state),
        drawerName: readDrawerName(state),
    };
};

const ConnectedComponent = connect(mapStateToProps, {})(Puntuation);

export default forwardRef((props, ref) => <ConnectedComponent {...props} puntuationRef={ref} />);
