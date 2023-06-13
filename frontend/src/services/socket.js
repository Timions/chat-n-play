import React from "react";
import { io } from "socket.io-client";

const socket = io( (process.env.NODE_ENV === 'production' ? 'wss://chat-n-play.vm.mi.hdm-stuttgart.de' : ''), { secure: true });
const SocketContext = React.createContext(socket);

export { socket };
export default SocketContext;