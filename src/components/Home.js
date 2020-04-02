import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import "../css/home.css";
import { Link } from 'react-router-dom';
import { Layout, Button, Input, Form } from "antd";
import { SmileOutlined, UserOutlined } from "@ant-design/icons";

const { Content } = Layout;

export default function Home({ user, logout }) {
    const [nickName, setNickName] = useState("");
    const [form] = Form.useForm();

    const handlePlayGame = ({ nickname }) => {
        // TODO when user isnt logged get the name.
    };

    useEffect(() => {
        form.setFieldsValue({
            nickname: user ? user.name : ""
        })
        setNickName(user ? user.name : "");
    }, []);

    return (
        <Layout className="layout">
            <Nav logout={logout} user={user} />
            <Content className="content">
                <div className="main-home">
                    <Form
                        form={form}
                        onFinish={handlePlayGame}
                        className="form"
                    >
                        <Form.Item name="nickname" value="ruben">
                            <Input
                                size="large"
                                disabled={nickName}
                                placeholder="Introduce tu nickname..."
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Link to="/game">
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    icon={<SmileOutlined />}
                                >
                                    Jugar
                            </Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
}
