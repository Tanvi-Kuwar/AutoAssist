import { io } from "socket.io-client";

const socket = io("https://autoassist-k2bl.onrender.com", {
  transports: ["websocket"],
});

export default socket;