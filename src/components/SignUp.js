import React, { useState } from "react";
import "../css/login.css";
import { Link, Redirect } from "react-router-dom";
import { signUp } from "../Helpers/auth-helpers";
import { Form, Input, Button, message } from "antd";
import { MdEmail } from "react-icons/md";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Nav from "./Nav";
import Footer from "./Footer";
import Http from '../Helpers/Http';
import "../css/login.css";

const key = "updatable";

const Register = ({ user, logout }) => {
    const [redirectToHome, setRedirectToHome] = useState(false);

    async function handleSignUp(user) {
        message.loading({ content: "Validando...", key });
        const res = await signUp(user);
        if (res.success) {
            message.success({ content: res.message, key, duration: 5 });
            setTimeout(() => setRedirectToHome(true), 1500);
        }
        else {
            message.error({ content: res.message, key, duration: 10 });
        }
    }

    return (
        <React.Fragment>
            {redirectToHome && <Redirect to="/logIn" />}
            <Nav logout={logout} user={user} />
            <div className="wrapForm">
                <Form className="login-form" onFinish={handleSignUp}>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                        Registrarse
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
                            prefix={<MdEmail className="site-form-item-icon" />}
                            placeholder="Introduce el email..."
                        />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Por favor introduce el nickname!"
                            }
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Introduce el nickname..."
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Por favor introduce la contraseña!"
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
                    <Form.Item
                        name="passwordCheck"
                        rules={[
                            {
                                required: true,
                                message: "Por favor introduce la contraseña!"
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder="Introduce de nuevo la contraseña..."
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Registrar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Footer />
        </React.Fragment>
    );
};

export default Register;
