import React from "react";
import "../css/login.css";
import { Link } from "react-router-dom";
import { whoAmI, logIn, signUp } from "../Helpers/auth-helpers";
import { Form, Input, Button, Checkbox, notification, Layout } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { MdEmail } from "react-icons/md";
import Nav from "./Nav";
import Footer from "./Footer";

const { Content } = Layout;
const key = "updatable";

const Login = ({ saveUser, logout }) => {

    async function handleLoggin(user) {
        const res = await logIn(user);

        if (res.success) {
            const data = await whoAmI();
            if (data.auth) {
                saveUser(data.user);
                notification.success({ message: "Logeado!", key, duration: 5 });
            }
        } 
        else {
            notification.error({ message: res.message, key, duration: 10 });
        }
    }

    return (
        <Layout className="layout">
            <Nav logout={logout} />
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

                            <a className="login-form-forgot" href="">
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

export default Login;
