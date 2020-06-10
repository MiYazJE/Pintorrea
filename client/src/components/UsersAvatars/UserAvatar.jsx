import React, { useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import Drawer from 'react-drag-drawer';
import UserProfile from '../UserProfile/UserProfile';
import { connect } from 'react-redux';
import { readName } from '../../Redux/Reducers/UserReducer';

const UserAvatar = ({ name, picture, id, size, showName, me }) => {
    const [showProfile, setShowProfile] = useState(false);

    const handleViewProfile = () => {
        setShowProfile(true);
    };

    const handleCloseModal = () => setShowProfile(false);

    return (
        <React.Fragment>
            <Tooltip placement="top" title={`Ver perfil de ${name}`}>
                <div className="avatar-box">
                    <Avatar
                        style={{ cursor: 'pointer' }}
                        src={picture}
                        onClick={() => handleViewProfile()}
                        size={size}
                    />
                    {showName ? (
                        <span style={{ color: name === me ? 'green' : null }}>
                            {name} {name === me ? '(Tú)' : null}
                        </span>
                    ) : null}
                </div>
            </Tooltip>
            <Drawer className="modal" open={showProfile} onRequestClose={handleCloseModal}>
                <UserProfile close={handleCloseModal} id={id} />
            </Drawer>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    me: readName(state),
});

export default connect(mapStateToProps, {})(UserAvatar);