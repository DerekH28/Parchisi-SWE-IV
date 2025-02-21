import { useState, useEffect } from "react";
import socket from "../api/sockets";

const Counter = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Listen for counter updates from the server
        socket.on("counterUpdate", (newCount) => {
            setCount(newCount);
        });

        return () => {
            socket.off("counterUpdate");
        };
    }, []);

    const handleIncrement = () => socket.emit("increment");
    const handleDecrement = () => socket.emit("decrement");
    const handleReset = () => socket.emit("reset");

    return (
        <div>
            <h2>WebSocket Counter: {count}</h2>
            <button onClick={handleIncrement}>Increase</button>
            <button onClick={handleDecrement}>Decrease</button>
            <button onClick={handleReset}>Reset</button>
        </div>
    );
};

export default Counter;
