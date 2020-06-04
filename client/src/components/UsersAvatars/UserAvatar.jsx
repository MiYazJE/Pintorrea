import React, { useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import Drawer from 'react-drag-drawer'
import UserProfile from '../UserProfile/UserProfile';

const UserAvatar = ({ name, picture, id, size }) => {
    const [showProfile, setShowProfile] = useState(false);

    const handleViewProfile = () => {
        setShowProfile(true);
    }

    const handleCloseModal = () => setShowProfile(false);

    return (
        <React.Fragment>
            <Tooltip placement="top" title={`Ver perfil de ${name}`}>
                <Avatar
                    style={{ cursor: 'pointer' }}
                    src={picture}
                    onClick={() => handleViewProfile()}
                    size={size} 
                />
            </Tooltip>
            <Drawer
                className="modal"
                open={showProfile}
                onRequestClose={handleCloseModal}
            >
                <UserProfile close={handleCloseModal} id={id} />
            </Drawer>
        </React.Fragment>
    );

}

export default UserAvatar;