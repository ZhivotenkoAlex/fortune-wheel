import { reactive } from "vue";
import { io, Socket } from "socket.io-client";

// Define the state object using Vue's reactive function
export const state = reactive({
  connected: false,
  gridData: {} as Data,
  FirstWheelResult: null as DataItem | null,
  SecondWheelResult: null as DataItem | null,
  wheelRotation: null as number | null,
});

// Define the URL for the socket connection
const URL = "https://hello-world-1-s56fejl5iq-uc.a.run.app";
// const URL = "http://localhost:5001";

// Create a socket instance and connect to the server
export const socket: Socket = io(URL, { transports: ["websocket"] });

// Check if the socket is not already connected, then connect
if (!socket.connected) {
  socket.connect();
}

// Event handler for when the socket is connected
socket.on("connect", () => {
  // Emit a "some connection" event to the server
  socket.emit("some connection", { for: "everyone" });
  // Update the state to indicate that the socket is connected
  state.connected = true;
});

// Event handler for receiving a "message" event from the server
socket.on("message", (data: Data) => {
  // Update the state with the received data
  state.gridData = data;
});

// Define the types for the data objects
export type Data = {
  gridData: DataItem[];
  gridRotate: number;
  gridSkewY: number;
  resultIndex: number;
  secondResultIndex: number;
  transitionTime_1: string;
  transitionTime_2: string;
};

type DataItem = {
  text: string;
  bgColor: string;
  fontColor: string;
  image: string;
};
