import React from "react";
import "../css/nav.css";
import "antd/dist/antd.css";
import { Layout } from "antd";
import "../css/footer.css";

const { Footer: FooterComponent } = Layout;

const Footer = () => {
    return (
        <FooterComponent className="footer">
            Pintorrea a los motores ©2020 Creado por Rubén Saiz
        </FooterComponent>
    );
}

export default Footer;