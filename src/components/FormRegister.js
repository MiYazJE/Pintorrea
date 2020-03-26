import React, { useRef } from "react";
import PasswordInput from "./PasswordInput";

export default function FormRegister({ view, handleRegister }) {
    const refName = useRef();
    const refEmail = useRef();
    const refPassword = useRef();
    const refPasswordCheck = useRef();

    function handleSubmit() {
        handleRegister({
            name: refName.current.value.trim(),
            email: refEmail.current.value.trim(),
            password: refPassword.current.value.trim(),
            passwordCheck: refPasswordCheck.current.value.trim()
        });
    }

    return (
        <div className={`wrap-register-form ${view ? "escondido" : ""}`}>
            <input
                className="margin-top"
                ref={refName}
                type="text"
                placeholder="Introduce tu nombre..."
            ></input>
            <input
                className="margin-top"
                ref={refEmail}
                type="email"
                placeholder="Introduce tu email..."
            ></input>
            <PasswordInput refPassword={refPassword} />
            <PasswordInput refPassword={refPasswordCheck} />
            <button className="btnRegistrar" onClick={handleSubmit}>
                Registrar
            </button>
        </div>
    );
}
