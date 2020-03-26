import React, { useState, useEffect, Fragment } from "react"
import { Link } from "react-router-dom"
import Nav from "./Nav"

export default function Game({ user }) {
    return (
        <Fragment>
            <Nav user={user} />
            <div></div>
        </Fragment>
    )
}
