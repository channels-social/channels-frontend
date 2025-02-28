import { io } from "socket.io-client";
import { hostUrl } from "./globals";

const socket = io(`${hostUrl}`, {
  path: "/ws",
  transports: ["websocket"],
});

export default socket;
