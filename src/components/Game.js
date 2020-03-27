import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Game({ user }) {
    return (
        <Fragment>
            <Nav user={user} />
            <Footer />
        </Fragment>
    );
}
