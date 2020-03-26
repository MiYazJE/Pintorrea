import React, { useState, useRef } from "react";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

export default function PasswordInput({ refPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    function handleToggleViewPassword() {
        setShowPassword(!showPassword);
    }

    return (
        <div className="password-wrap">
            <input
                ref={refPassword}
                type={showPassword ? 'text' : 'password'}
                placeholder="Introduce una contraseña..."
            ></input>
            {showPassword ? (
                <IoIosEye className="eye-icon" onClick={handleToggleViewPassword} />
            ) : (
                <IoIosEyeOff className="eye-icon" onClick={handleToggleViewPassword} />
            )}
        </div>
    );
}
