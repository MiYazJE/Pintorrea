import React from "react";
import Message from "./Message";

export default function ListMessages({ listMessages, deleteMessage }) {
    return (
        <div className="list-messages">
            {listMessages.map(message => (
                <Message
                    key={message.key}
                    message={message}
                    deleteMessage={deleteMessage}
                />
            ))}
        </div>
    );
}
