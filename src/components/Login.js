import React, { useState } from "react";
import "../css/login.css";
import { Link, Redirect } from "react-router-dom";
import { whoAmI, signIn } from "../Helpers/auth-helpers";
import { Form, Input, Button, Checkbox, notification, Layout } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { MdEmail } from "react-icons/md";
import Nav from "./Nav";
import Footer from "./Footer";
import { connect } from 'react-redux';
import { logUser } from '../Redux/Actions/UserActions';

const { Content } = Layout;
const key = "updatable";

const Login = ({ logUser }) => {
    const [redirect, setRedirect] = useState(false);

    async function handleLoggin(user) {
        const res = await signIn(user);

        if (res.success) {
            const data = await whoAmI();
            if (data.auth) {
                logUser(data.user);
                notification.success({
                    message: 'Has sido logeado satisfactoriamente!',
                    key,
                    duration: 5,
                    placement: 'bottomRight'
                });
                setTimeout(() => setRedirect(true), 1000);
            }
        }
        else {
            notification.error({
                message: res.message,
                key,
                duration: 10,
                placement: 'bottomRight'
            });
        }
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
                        onFinish={handleLoggin}
                    >
                        <h1 style={{ textAlign: "center", color: "white" }}>
                            Login
                        </h1>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor introduce el email!"
                                }
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
                            >
                                Entrar
                            </Button>
                            <Link style={{ marginLeft: "30px" }} to="/signUp">
                                Registrate ahora!
                            </Link>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default connect(null, { logUser })(Login);
