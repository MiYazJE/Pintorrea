import React, { useState, useEffect } from "react";
import { Link, Redirect} from "react-router-dom";
import { whoAmI, signIn } from "../../Helpers/auth-helpers";
import Http from "../../Helpers/Http";
import { Form, Input, Button, Checkbox, notification, Layout } from "antd";
import { LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { MdEmail } from "react-icons/md";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { connect } from 'react-redux';
import { logUser } from '../../Redux/Actions/UserActions';
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

const Login = ({ logUser }) => {
    const [redirect, setRedirect] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { auth } = await Http.get('/auth/google/user');
            if (auth) {
                setUser(() => {
                    notification.success({
                        message: 'Has sido logeado satisfactoriamente!',
                        key,
                        duration: 5,
                        placement: 'bottomRight'
                    });
                });    
            }
        })();
    }, []);

    const setUser = async (success) => {
        const data = await whoAmI();
        if (data.auth) {
            logUser(data.user, data.auth);
            success();
        }
    }

    async function handleLogin(user) {
        setLocalLoading(true);
        const res = await signIn(user);
        if (res.success) {
            setUser(() => {
                notification.success({
                    message: 'Has sido logeado satisfactoriamente!',
                    key,
                    duration: 5,
                    placement: 'bottomRight'
                });
            });
        }
        else {
            notification.error({
                message: res.message,
                key,
                duration: 10,
                placement: 'bottomRight'
            });
        }
        setLocalLoading(false);
    }

    return (
        <Layout className="layout">
            {redirect ? <Redirect to="/" /> : null}
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
                            Login
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
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox>
                                    <span className="message">
                                        Recordar contraseña
                                    </span>
                                </Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/validatePassword">
                                Olvidaste la contraseña
                            </a>
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
                            <Link style={{ marginLeft: "30px" }} to="/signUp">
                                Registrate ahora!
                            </Link>
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

export default connect(null, { logUser })(Login);
