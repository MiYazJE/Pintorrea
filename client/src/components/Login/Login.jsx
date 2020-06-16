import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, notification, Layout } from "antd";
import { LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { MdEmail } from "react-icons/md";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { connect } from 'react-redux';
import { signIn, googleSignIn } from '../../actions/userActions';
import { readAuth } from '../../reducers/userReducer';
import "./login.scss";

const { Content } = Layout;
const key = "updatable";

const validateEmail = (_, email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
        return Promise.resolve();
    }
    return Promise.reject("El email no es válido!");
}

const Login = ({ signIn, googleSignIn, auth }) => {
    const [localLoading, setLocalLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        googleSignIn(() => {
            notification.success({
                message: 'Has sido logeado satisfactoriamente!',
                key,
                duration: 5,
                placement: 'bottomRight'
            });
        });    
    }, []);

    async function handleLogin(user) {
        setLocalLoading(true);
        signIn(
            user, 
            () => {
                notification.success({
                    message: 'Has sido logeado satisfactoriamente!',
                    key,
                    duration: 5,
                    placement: 'bottomRight'
                });
                setLocalLoading(false);
            },(message) => {
                notification.error({
                    message,
                    key,
                    duration: 10,
                    placement: 'bottomRight'
                });
                setLocalLoading(false);
        });
    }

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                <div className="wrapForm">
                    <Form
                        size="large"
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={handleLogin}
                    >
                        <h1 style={{ textAlign: "center", color: "white" }}>
                            Entrar
                        </h1>
                        <Form.Item
                            name="email"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor introduce el email!"
                                },
                                { validator: validateEmail }
                            ]}
                        >
                            <Input
                                prefix={
                                    <MdEmail className="site-form-item-icon" />
                                }
                                placeholder="Introduce el email..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Por favor introduce tu contraseña!"
                                }
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                type="password"
                                placeholder="Introduce la contraseña..."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                loading={localLoading}
                            >
                                Entrar
                            </Button>
                            <Button type="link" style={{ marginLeft: "30px" }} onClick={() => history.push('/signUp')}>
                                No tienes cuenta?
                            </Button>
                        </Form.Item>
                        <div className="wrapButtonsLogin">
                            <a href="/auth/google">
                                <Button
                                    icon={<GoogleOutlined />}
                                    type="primary"
                                    loading={googleLoading}
                                    onClick={() => setGoogleLoading(true)}
                                >Entrar con google</Button>
                            </a>
                        </div>
                    </Form>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

const mapStateToProps = (state) => ({
    auth: readAuth(state)
});

const mapDispatchToProps = (dispatch) => ({
    signIn      : (user, success, error) => dispatch(signIn(user, success, error)),
    googleSignIn: (callback) => dispatch(googleSignIn(callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
