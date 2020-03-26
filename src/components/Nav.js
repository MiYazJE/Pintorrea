import React, { useState, useEffect } from "react";
import "../css/nav.css";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined
} from "@ant-design/icons";
const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

export default function Nav({ user, logout }) {
    return (
        <Header>
            <div className="logo" />
            <Menu
                theme="dark"
                className="nav"
                mode="horizontal"
                defaultSelectedKeys={["2"]}
            >
                <Menu.Item key="1">Inicio</Menu.Item>
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">Ranking</span>
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
                        <Menu.Item key="setting:2">Ver Perfil</Menu.Item>
                        <Menu.Item key="setting:1" onClick={logout}>
                            Logout
                        </Menu.Item>
                    </SubMenu>
                ) : (
                    <Menu.Item key="alipay">
                        <Link to="/login">
                            <UserOutlined />
                            Iniciar sesión
                        </Link>
                    </Menu.Item>
                )}
            </Menu>
        </Header>
    );
}
