import React, { useState, useRef } from "react";
import "../css/login.css";
import { Link } from "react-router-dom";
import ListMessages from "./ListMessages";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";
import { Redirect } from "react-router-dom";
import { whoAmI, logIn, signUp } from "../Helpers/auth-helpers";

const generateKey = pre => `${pre}_${new Date().getTime()}`;

export default function Login({ saveUser }) {
    const [toHome, setToHome] = useState(false);
    const [viewLogin, setViewLogin] = useState(true);
    const [listMessages, setListMessages] = useState([]);

    async function handleRegister({ name, email, password, passwordCheck }) {
        const res = await signUp({ 
            name, 
            email,
            password,
            passwordCheck
        });

        setListMessages([
            ...listMessages,
            {
                status: res.succes ? "ok" : "error",
                message: res.message,
                key: generateKey(listMessages.length)
            }
        ]);
        
        if (res.succes) {
            redirectToHome();
        }
    }

    function deleteMessage(k) {
        setListMessages(listMessages.filter(({ key }) => key !== k));
    }

    function redirectToHome() {
        setTimeout(() => {
            setToHome(true);
        }, 2000);
    }

    async function handleLoggin({ email, password }) {
        const res = await logIn({
            email,
            password
        });

        setListMessages([
            ...listMessages,
            {
                message: res.message,
                status: res.succes ? "ok" : "error",
                key: generateKey(listMessages.length)
            }
        ]);

        if (res.succes) {
            const data = await whoAmI(); 
            if (data.auth) {
                saveUser(data.user);
                redirectToHome();
            }
        }
    }

    return (
        <React.Fragment>
            {toHome ? <Redirect to={"/"} /> : null}
            <div className="header">
                <Link to="/">
                    <h1 className="logo">PINTORREA</h1>
                </Link>
            </div>
            <main>
                <div className="form">
                    <div className="wrap-selection">
                        <div className="login-selection">
                            <button
                                className={`btn-selection-login border-left ${
                                    viewLogin ? "btnSelected" : ""
                                }`}
                                onClick={() => {
                                    setListMessages([]);
                                    setViewLogin(!viewLogin);
                                }}
                            >
                                Entrar
                            </button>
                        </div>
                        <div className="register-selection">
                            <button
                                className={`btn-selection-register ${
                                    !viewLogin ? "btnSelected border-right" : ""
                                }`}
                                onClick={() => {
                                    setListMessages([]);
                                    setViewLogin(!viewLogin);
                                }}
                            >
                                Nuevo Usuario
                            </button>
                        </div>
                    </div>
                    <FormLogin
                        saveUser={saveUser}
                        view={viewLogin}
                        handleLoggin={handleLoggin}
                    />
                    <FormRegister
                        saveUser={saveUser}
                        view={viewLogin}
                        handleRegister={handleRegister}
                    />
                </div>
            </main>
            <ListMessages
                listMessages={listMessages}
                deleteMessage={deleteMessage}
            />
        </React.Fragment>
    );
}
