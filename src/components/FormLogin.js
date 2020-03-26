import React, { useRef } from "react";
import PasswordInput from './PasswordInput';

export default function FormLogin({ view, handleLoggin }) {
    const refEmail = useRef();
    const refPassword = useRef();

    function handleSubmit() {
        handleLoggin({
            email: refEmail.current.value.trim(),
            password: refPassword.current.value.trim()
        });
    }

    return (
        <div className={`wrap-login-form ${!view ? "escondido" : ""}`}>
            <input
                className="margin-top"
                type="email"
                placeholder="Introduce tu email..."
                ref={refEmail}
            ></input>
            <PasswordInput refPassword={refPassword} />
            <button className="btnLogin" onClick={handleSubmit}>
                Entrar
            </button>
        </div>
    );
}
