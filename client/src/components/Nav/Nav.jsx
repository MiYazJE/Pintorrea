import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import EditAvatar from '../EditAvatar/EditAvatar';
import EditProfile from '../EditProfile/EditProfile';
import { Layout, Menu, notification, Avatar } from 'antd';
import Drawer from 'react-drag-drawer';
import { UserOutlined, LogoutOutlined, EditOutlined, ClusterOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { readUser, readImage } from '../../reducers/userReducer';
import { logOut } from '../../actions/userActions';
import 'antd/dist/antd.css';
import './nav.scss';

const { Header } = Layout;
const { SubMenu } = Menu;
const key = 'updatable';

const Nav = ({ user, logOut, picture }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditAvatar, setShowEditAvatar] = useState(false);
    const history = useHistory();

    const toggleShowModal = () => {
        setShowEditAvatar(false);
        setShowProfile(false);
        setShowModal(false);
    };

    const handleLogout = () => {
        logOut(() => {
            notification.success({
                message: 'Sesión cerrada!',
                key,
                duration: 5,
                placement: 'bottomRight',
            });
            history.push('/login');
        });
    };

    const handleShowModal = (set) => {
        set(true);
        setShowModal(true);
    };

    return (
        <Header className="header">
            <Menu theme="dark" className="nav" mode="horizontal">
                {user.auth ? (
                    <Menu.Item key="link-inicio" onClick={() => history.push('/')}>
                        <span className="centerIcon">
                            Salas   
                            <UnorderedListOutlined style={{marginLeft: '5px'}} />
                        </span>
                    </Menu.Item>
                ) : null}
                {user.auth ? (
                    <Menu.Item
                        key="link-ranking"
                        onClick={() => history.push('/ranking')}
                    >
                        <span className="centerIcon">
                            Ranking
                            <ClusterOutlined style={{marginLeft: '5px'}} />
                        </span>
                    </Menu.Item>
                ) : null}
                {user.auth ? (
                    <SubMenu
                        title={
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '5px' }}>{user.name}</span>
                                <Avatar style={{ backgroundColor: 'white' }} src={picture} />
                            </span>
                        }
                    >
                        <Menu.ItemGroup title="Perfil">
                            <Menu.Item
                                key="link-profile"
                                onClick={() => handleShowModal(setShowProfile)}
                            >
                                <UserOutlined />
                                Editar
                            </Menu.Item>
                            <Menu.Item
                                icon={<EditOutlined />}
                                key="link-avatar"
                                onClick={() => handleShowModal(setShowEditAvatar)}
                            >
                                Avatar
                            </Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.Item key="link-logout" onClick={handleLogout}>
                            Cerrar sesión
                            <LogoutOutlined style={{ marginLeft: '5px' }} />
                        </Menu.Item>
                    </SubMenu>
                ) : (
                    <Menu.Item onClick={() => history.push('/login')}>
                        <UserOutlined />
                        Iniciar sesión
                    </Menu.Item>
                )}
            </Menu>
            <Drawer open={showModal} onRequestClose={toggleShowModal}>
                {showProfile ? <EditProfile /> : null}
                {showEditAvatar ? <EditAvatar /> : null}
            </Drawer>
        </Header>
    );
};

const mapStateToProps = (state) => ({
    user: readUser(state),
    picture: readImage(state),
});

const mapDispatchToProps = (dispatch) => ({
    logOut: (callback) => dispatch(logOut(callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
