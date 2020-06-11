import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, notification, Layout, Radio } from 'antd';
import { MdEmail } from 'react-icons/md';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { IoIosMale, IoIosFemale } from 'react-icons/io';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import Http from '../../Helpers/Http';
import { connect } from 'react-redux';
import { register } from '../../actions/userActions';
import './signUp.scss';

const { Content } = Layout;
const key = 'updatable';

const Register = ({ register }) => {
    const [form] = Form.useForm();
    const history = useHistory(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            gender: 'male'
        });
    }, []);

    async function handleSignUp(user) {
        setLoading(true);
        console.log(user)
        const success = (message) => {
            notification.success({ message, key, duration: 8 });
            setLoading(false);
            history.push('/login');
        };
        const error = (message) => {
            notification.error({ message, key, duration: 8 });
            setLoading(false);
        };
        register(user, success, error);
    }

    const validateEmail = (_, email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())) {
            return validateEmailExists(email);
        }
        return Promise.reject('El email no es válido!');
    };

    const validateEmailExists = async (email) => {
        const { emailExists } = await Http.get(`/user/exists/email/${email}`);
        if (emailExists) {
            return Promise.reject('Este email ya se encuentra registrado!');
        }
        return Promise.resolve();
    };

    const validateUserNameExists = async (_, nickName) => {
        if (!nickName) return;
        const { userExists } = await Http.get(`/user/exists/name/${nickName}`);
        if (userExists) {
            return Promise.reject('Este nombre ya se encuentra registrado!');
        }
        return Promise.resolve();
    };

    const validatePasswords = ({ getFieldValue }) => ({
        validator(rule, value) {
            if (getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject('Las contraseñas no coinciden!');
        },
    });

    return (
        <Layout className="layout">
            <Nav />
            <Content className="content">
                <div className="wrapForm">
                    <Form form={form} className="login-form" onFinish={handleSignUp}>
                        <h1 style={{ textAlign: 'center', color: 'white' }}>Registrarse</h1>
                        <Form.Item
                            name="email"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor introduce el correo.',
                                },
                                { validator: validateEmail },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<MdEmail className="site-form-item-icon" />}
                                placeholder="Introduce el email..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor introduce el nickname!',
                                },
                                { validator: validateUserNameExists },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Introduce el nickname..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor introduce la contraseña!',
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Introduce la contraseña..."
                            />
                        </Form.Item>
                        <Form.Item
                            size="large"
                            name="passwordCheck"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor vuelve a repetir la contraseña!',
                                },
                                validatePasswords,
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Introduce de nuevo la contraseña..."
                            />
                        </Form.Item>
                        <Form.Item name="gender">
                                <Radio.Group size="middle">
                                    <Radio.Button value="male">
                                        <span className="radioItem">
                                            <IoIosMale />Hombre
                                        </span>
                                    </Radio.Button>
                                    <Radio.Button value="female">
                                        <span className="radioItem">
                                            <IoIosFemale />Mujer
                                        </span>
                                    </Radio.Button>
                                </Radio.Group>
                            {/* <div className="wrapRadioButtons">
                            </div> */}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
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

const mapDispatchToProps = (dispatch) => ({
    register: (user, success, error) => dispatch(register(user, success, error)),
});

export default connect(null, mapDispatchToProps)(Register);
