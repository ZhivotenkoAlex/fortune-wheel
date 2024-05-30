import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  gridData: {} as Data,
});

const URL = "https://hello-world-1-s56fejl5iq-uc.a.run.app";

export const socket = io(URL, { transports: ["websocket"] });

socket.on("connect", () => {
  socket.emit("some connection", { for: "everyone" });
  state.connected = true;
});

socket.on("message", (data: Data) => {
  state.gridData = data;
});

type Data = {
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
};
