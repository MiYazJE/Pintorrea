import React from "react";
import "../css/profile.css";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function Profile({ user }) {
    console.log(user)
    return (
        <div className="wrapProfile">
            <Avatar size={150}  src={user.picture && user.picture} icon={!user.picture && <UserOutlined />} />
            <h2>{user.name}</h2>
        </div>
    );
}
