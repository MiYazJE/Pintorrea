import React, { useState } from "react";
import "../css/login.css";
import { Redirect } from "react-router-dom";
import { signUp } from "../Helpers/auth-helpers";
import { Form, Input, Button, notification, Layout } from "antd";
import { MdEmail } from "react-icons/md";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Nav from "./Nav";
import Footer from "./Footer";
import Http from '../Helpers/Http';
import "../css/login.css";

const { Content } = Layout;
const key = "updatable";

const Register = () => {
    const [validateStatus, setValidateStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [redirectToHome, setRedirectToHome] = useState(false);

    async function handleSignUp(user) {
        setLoading(true);
        const res = await signUp(user);
        if (res.success) {
            notification.success({ message: res.message, key, duration: 5 });
            setTimeout(() => setRedirectToHome(true), 1500);
        } else {
            notification.error({ message: res.message, key, duration: 10 });
        }
        setLoading(false)
    }

    const validateEmail = (_, email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())) {
            return Promise.resolve();
        }
        return Promise.reject("El email no es válido!");
    }

    const validatePasswords = ({ getFieldValue }) => ({
        validator(rule, value) {
            if (getFieldValue("password") === value) {
                return Promise.resolve();
            }
            return Promise.reject("Las contraseñas no coinciden!");
        }
    })

    const validateUserName = async (_, nickName) => {
        if (!nickName) return;
        const { userExists } = await Http.get(`/user/${nickName}`);
        if (userExists) {
            return Promise.reject('Este nombre ya se encuentra registrado...');
        }
        return Promise.resolve();
    }

    return (
        <Layout className="layout">
            {redirectToHome && <Redirect to="/logIn" />}
            <Nav />
            <Content className="content">
                <div className="wrapForm">
                    <Form className="login-form" onFinish={handleSignUp}>
                        <h1 style={{ textAlign: "center", color: "white" }}>
                            Registrarse
                        </h1>
                        <Form.Item
                            name="email"
                            hasFeedback
                            rules={
                                [
                                    { 
                                        required: true,
                                        message: 'Por favor introduce el correo.'
                                    },
                                    { validator: validateEmail }
                                ]
                            }
                        >
                            <Input
                                size="large"
                                prefix={
                                    <MdEmail className="site-form-item-icon" />
                                }
                                placeholder="Introduce el email..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="nickname"
                            hasFeedback
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Por favor introduce el nickname!"
                                    }, 
                                    { validator: validateUserName }
                                ]
                            }
                        >
                            <Input
                                size="large"
                                prefix={
                                    <UserOutlined className="site-form-item-icon" />
                                }
                                placeholder="Introduce el nickname..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            hasFeedback
                            rules={
                                [{
                                    required: true,
                                    message: "Por favor introduce la contraseña!" 
                                }]
                            }
                        >
                            <Input.Password
                                size="large"
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                type="password"
                                placeholder="Introduce la contraseña..."
                            />
                        </Form.Item>
                        <Form.Item
                            size="large"
                            name="passwordCheck"
                            hasFeedback
                            rules={
                                [
                                    {
                                        required : true,
                                        message  : "Por favor vuelve a repetir la contraseña!"
                                    }, 
                                    validatePasswords
                                ]
                            }
                        >
                            <Input.Password
                                size="large"
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
                                loading={loading}
                            >
                                Registrar
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default Register;
