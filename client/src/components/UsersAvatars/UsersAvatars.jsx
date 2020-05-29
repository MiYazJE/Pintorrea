import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserAvatar from './UserAvatar';

const UsersAvatars = ({ users }) => {
    return(
        <div className="users-profiles">
            {users.map((user, index) => (
                user ? <UserAvatar key={user.id} name={user.name} picture={user.picture} id={user.id} />
                    : <Avatar key={index} icon={<UserOutlined />} />
            ))}
        </div>
    );
}

export default UsersAvatars;