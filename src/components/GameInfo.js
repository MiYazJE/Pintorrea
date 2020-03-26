import React, { useState, useEffect } from "react";
import "../css/game.css";
import UserInfo from "./UserInfo";
import { Link } from "react-router-dom";

export default function GameInfo({ user, logout }) {

    return (
        <div className="wrap-game">
            <UserInfo logout={logout} user={user} />
            <div className="info-game">
                <div className="wrap-input">
                    <label htmlFor="nickname">
                        NICKNAME:
                        <input
                            id="nickname"
                            type="text"
                        ></input>
                    </label>
                </div>
                <Link to="/game">
                    <button className="btnPlay">Jugar</button>
                </Link>
            </div>
        </div>
    );
}
