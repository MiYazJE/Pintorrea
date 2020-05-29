import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UsersAvatars = ({ users }) => {

    const handleViewProfile = (name, id) => {
        console.log(`view ${name}'s profile`);
    }

    return(
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
    );

}

export default UsersAvatars;