import React from "react";
import { Link } from "react-router-dom";

export default function UserInfo({ logout, user }) {
    return (
        <div className="wrap-userInfo">
            {user ? (
                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
                    <p className="name">{user.name}</p>
                    <button style={{backgroundColor: 'white'}} onClick={logout}>Salir</button>
                </div>
            ) : (
                <Link style={{ color: "inherit" }} to="/login">
                    <p>Iniciar sesión...</p>
                </Link>
            )}
        </div>
    );
}
