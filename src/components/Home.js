import React, { useState, Fragment } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import "../css/home.css";
import { Layout } from "antd";

const { Content } = Layout;

export default function Home({ user, logout }) {
    return (
        <Layout className="layout">
            <Nav logout={logout} user={user} />
            <Content className="content">

            </Content>
            <Footer />
        </Layout>
    );
}
