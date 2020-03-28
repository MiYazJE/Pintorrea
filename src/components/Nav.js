import React, { useState } from "react";
import "../css/nav.css";
import { Link } from "react-router-dom";
import Profile from './Profile';
import "antd/dist/antd.css";
import { Layout, Menu, Modal, Button } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
const { Header } = Layout;

const { SubMenu } = Menu;

export default function Nav({ user, logout }) {
    const [showProfile, setShowProfile] = useState(false);

    const toggleShowProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <Header className="header">
            <div className="logo" />
            <Menu theme="dark" className="nav" mode="horizontal">
                <Menu.Item key="1">
                    <Link to="/">Inicio</Link>
                </Menu.Item>
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <UnorderedListOutlined />
                            Ranking
                        </span>
                    }
                >
                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                    <Menu.Item key="setting:2">Option 2</Menu.Item>
                </SubMenu>
                {user ? (
                    <SubMenu
                        title={
                            <span className="submenu-title-wrapper">
                                <UserOutlined />
                                {user.name}
                            </span>
                        }
                    >
                        <Menu.Item onClick={toggleShowProfile} key="setting:2">
                            <ProfileOutlined style={{ marginRight: "5px" }} />
                            Ver Perfil
                        </Menu.Item>
                        <Menu.Item key="setting:1" onClick={logout}>
                            <LogoutOutlined style={{ marginRight: "5px" }} />
                            Logout
                        </Menu.Item>
                    </SubMenu>
                ) : (
                    <Menu.Item key="alipay">
                        <UserOutlined />
                        <Link to="/login">Iniciar sesión</Link>
                    </Menu.Item>
                )}
            </Menu>
            <Modal
                visible={showProfile}
                title="Perfil"
                onOk={toggleShowProfile}
                onCancel={toggleShowProfile}
            >
                <Profile user={user} />
            </Modal>
        </Header>
    );
}
