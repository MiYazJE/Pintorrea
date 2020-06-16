import React from "react";
import "antd/dist/antd.css";
import { Layout } from "antd";
import "./footer.scss";

const { Footer: FooterComponent } = Layout;

const Footer = () => {
    return (
        <FooterComponent className="footer">
            Pintorrea ©2020, todos los derechos reservados.
        </FooterComponent>
    );
}

export default Footer;