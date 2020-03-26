import React, { useState, useRef } from "react";
import { MdClose } from "react-icons/md";

export default function Message({ message: msg, deleteMessage }) {
    const { status, message, key } = msg;
    const [hide, setHide] = useState(false);
    const refMessage = useRef();

    function handleHideMessage() {
        setHide(true);
        refMessage.current.addEventListener("transitionend", () => {
            refMessage.current.style.display = "none";
            deleteMessage(key);
        });
    }

    return (
        <div
            ref={refMessage}
            className={`wrap-message ${!hide ? "transicionar" : ""} ${
                status === "ok" ? "message-okay" : "message-error"
            } `}
        >
            <p>{message}</p>
            <div className="closeMessage" onClick={() => handleHideMessage()}>
                <MdClose />
            </div>
        </div>
    );
}
