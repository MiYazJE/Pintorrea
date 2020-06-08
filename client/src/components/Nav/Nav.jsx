import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import EditAvatar from '../EditAvatar/EditAvatar';
import EditProfile from '../EditProfile/EditProfile'
import { Layout, Menu, notification, Avatar } from "antd";
import Drawer from 'react-drag-drawer';
import {
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { connect } from 'react-redux';
import { readUser, readImage } from '../../Redux/Reducers/UserReducer';
import { logOut } from '../../Redux/Actions/UserActions';
import "antd/dist/antd.css";
import "./nav.scss";

const { Header } = Layout;
const { SubMenu } = Menu;
const key = 'updatable';

const Nav = ({ user, logOut, picture }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditAvatar, setShowEditAvatar] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const toggleShowModal = () => {
        setShowEditAvatar(false);
        setShowProfile(false);
        setShowModal(false);
    }

    const handleLogout = () => {
        logOut(() => {
            notification.success({
                message: "Sesión cerrada!",
                key,
                duration: 5,
                placement: 'bottomRight'
            });
            setRedirect(true);
        });
    }

    const handleShowModal = (set) => {
        set(true);
        setShowModal(true)
    }

    return (
        <Header className="header">
            {redirect ? <Redirect to="/login" /> : null}
            <div className="logo" />
            <Menu theme="dark" className="nav" mode="horizontal">
                <Menu.Item key="link-inicio">
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
                    <Menu.Item>Option 1</Menu.Item>
                    <Menu.Item>Option 2</Menu.Item>
                </SubMenu>
                {user.auth ? (
                    <SubMenu
                        title={
                            <span style={{display: 'flex', alignItems: 'center'}}>
                                <Avatar style={{backgroundColor: 'white'}} src={picture} />
                                <span style={{marginLeft: '5px'}}>{user.name}</span>
                            </span>
                        }
                    >
                        <Menu.ItemGroup title="Perfil">
                            <Menu.Item key="link-profile" onClick={() => handleShowModal(setShowProfile)}>
                                <ProfileOutlined style={{ marginRight: "5px" }} />
                                Editar
                            </Menu.Item>
                            <Menu.Item key="link-avatar" onClick={() => handleShowModal(setShowEditAvatar)}>
                                <ProfileOutlined style={{ marginRight: "5px" }} />
                                Avatar
                            </Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.Item key="link-logout" onClick={handleLogout}>
                            <LogoutOutlined style={{ marginRight: "5px" }} />
                            Cerrar sesión
                        </Menu.Item>
                    </SubMenu>
                ) : (
                        <Menu.Item>
                            <UserOutlined />
                            <Link to="/login">Iniciar sesión</Link>
                        </Menu.Item>
                    )}
            </Menu>
            <Drawer
                open={showModal}
                onRequestClose={toggleShowModal}
            >
                {showProfile ? <EditProfile /> : null}
                {showEditAvatar ? <EditAvatar /> : null}
            </Drawer>
        </Header>
    );
}

const mapStateToProps = state => ({ 
    user: readUser(state),
    picture: readImage(state)
});

export default connect(mapStateToProps, { logOut })(Nav);