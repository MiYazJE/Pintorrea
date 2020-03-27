import React, { useState } from "react";
import "../css/login.css";
import { Link } from "react-router-dom";
import { whoAmI, logIn, signUp } from "../Helpers/auth-helpers";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { MdEmail } from 'react-icons/md';
import Nav from "./Nav";
import Footer from "./Footer";

const key = "updatable";

const Login = ({ saveUser, logout }) => {
    async function handleLoggin(user) {
        message.loading({ content: "Validando...", key });
        const res = await logIn(user);

        if (res.success) {
            const data = await whoAmI();
            if (data.auth) {
                saveUser(data.user);
                message.success({ content: "Logeado!", key, duration: 5 });
            }
        }
        else {
            message.error({ content: res.message, key, duration: 10 });
        }
    }

    return (
        <React.Fragment>
            <Nav logout={logout} />
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
                                message: "Por favor introduce tu contraseña!"
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
                            <Checkbox><span className="message">Recordar contraseña</span></Checkbox>
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
            <Footer />
        </React.Fragment>
    );
};

export default Login;
