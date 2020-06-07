import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import EditAvatar from '../EditAvatar/EditAvatar';
import EditProfile from '../EditProfile/EditProfile'
import { Layout, Menu, Modal, notification, Avatar } from "antd";
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
    const [showEditAvatar, setShowEditAvatar] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const toggleShowModal = () => {
        setShowEditAvatar(false);
        setShowProfile(false)
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

    return (
        <Header className="header">
            {redirect ? <Redirect to="/login" /> : null}
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
                            <Menu.Item onClick={() => setShowProfile(true)} key="setting:3">
                                <ProfileOutlined style={{ marginRight: "5px" }} />
                                Editar
                            </Menu.Item>
                            <Menu.Item onClick={() => setShowEditAvatar(true)} key="setting:4">
                                <ProfileOutlined style={{ marginRight: "5px" }} />
                                Avatar
                            </Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.Item key="setting:5" onClick={handleLogout}>
                            <LogoutOutlined style={{ marginRight: "5px" }} />
                            Cerrar sesión
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
                visible={showEditAvatar || showProfile}
                onOk={toggleShowModal}
                onCancel={toggleShowModal}
                destroyOnClose={true}
            >
                {showProfile ? <EditProfile /> : null}
                {showEditAvatar ? <EditAvatar /> : null}
            </Modal>
        </Header>
    );
}

const mapStateToProps = state => ({ 
    user: readUser(state),
    picture: readImage(state)
});

export default connect(mapStateToProps, { logOut })(Nav);