import { reactive } from "vue";
import { io, Socket } from "socket.io-client";
import { notify } from "./helpers";

// Define the state object using Vue's reactive function
export const state = reactive({
  connected: false,
  gridData: {} as Data,
  firstWheelResult: null as number | null,
  secondWheelResult: null as number | null,
  wheelRotation: null as number | null,
  ping: null as number | null,
  isLoaded: false,
  userId: null as string | null,
  data: {} as any,
  firstFinishDegree: null as number | null,
  secondFinishDegree: null as number | null,
  gameResult: {} as any,
});

// Define the URL for the socket connection
const URL = "https://hello-world-1-s56fejl5iq-uc.a.run.app";
// const URL = "http://localhost:5001";

export const socket: Socket = io(URL, { transports: ["websocket"] });

// Check if the socket is not already connected, then connect
if (!socket.connected) {
  socket.connect();
}

socket.on("connect", () => {
  socket.emit("some connection", { for: "everyone" });
  state.connected = true;
});

socket.on("error", (error) => {
  notify(error);
});

export type Data = {
  gridData: DataItem[];
  gridRotate: number;
  gridSkewY: number;
};

export type DataItem = {
  text: string;
  bgColor: string;
  fontColor: string;
  image: string;
};
