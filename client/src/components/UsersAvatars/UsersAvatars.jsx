import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserAvatar from './UserAvatar';
import './usersAvatars.scss';

const UsersAvatars = ({ users, size, showNames }) => {
    return (
        <div className="users-profiles">
            {users.map((user, index) =>
                user ? (
                    <UserAvatar
                        size={size}
                        showName={showNames}
                        key={user.id}
                        name={user.name}
                        picture={user.picture}
                        id={user.id}
                    />
                ) : (
                    <Avatar key={index} icon={<UserOutlined />} />
                )
            )}
        </div>
    );
};

export default UsersAvatars;
