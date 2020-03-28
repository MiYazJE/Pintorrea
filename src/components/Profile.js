import React from "react";
import "../css/profile.css";
import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function Profile({ user }) {
    return (
        <div className="wrapProfile">
            <Avatar size={150} icon={<UserOutlined />} />
            <h2>{user.name}</h2>
        </div>
    );
}
