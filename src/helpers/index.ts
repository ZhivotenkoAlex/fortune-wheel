import dairy_milk from "../assets/dairy_milk.png";
import rice_cake from "../assets/rice_cake.png";
import truffle_lindt from "../assets/truffle_lindt.png";
import prize from "../assets/prize.png";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const images: Record<string, string> = {
  dairy_milk: dairy_milk,
  rice_cake: rice_cake,
  truffle_lindt: truffle_lindt,
  prize: prize,
};

export function isEmpty(obj: Record<string, any>) {
  obj = obj || {};
  return Object.keys(obj).length === 0;
}

export function getTokenFromUrl() {
  const demoToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVcXVCdnU4bDVUNlpuS0c0Z2pkUCIsInVzZXJuYW1lIjoiZGVtb0BnYW1lLmNvbSIsImlhdCI6MTczMzQ0MzU0MCwiZXhwIjoxODg4OTYzNTQwfQ.O_BelqUuxYBsfvWFewcHb4GRRgZBNVdnSAEO-eh84-M";
  const urlParams = new URLSearchParams(window.location.search);
  let accessToken = urlParams.get("access_token");
  if (!accessToken) {
    accessToken = demoToken;
  }
  return accessToken;
}

export function getGameIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("game_id");
}

export function getTokenFromCookie() {
  return document.cookie
    ?.split("; ")
    .find((row: any) => row.startsWith("token"))
    ?.split("=")[1];
}

export function getTokenFromMessage(event: MessageEvent): string | null {
  // TODO: Replace this hardcoded origin with the actual origin of the frontend
  const origins = [
    "http://localhost:5173",
    "https://hello-world-1-s56fejl5iq-uc.a.run.app",
    "https://wheel-api-s56fejl5iq-lm.a.run.app",
  ];

  if (origins.includes(event.origin)) {
    return event.data.token;
  }
  return null;
}

export function getAccessToken(): Promise<string | null> {
  return new Promise((resolve) => {
    let token: string | null | undefined = getTokenFromUrl();
    if (token) {
      resolve(token);
    } else {
      token = getTokenFromCookie();
      if (token) {
        resolve(token);
      } else {
        const messageHandler = (event: MessageEvent) => {
          token = getTokenFromMessage(event);
          if (token) {
            window.removeEventListener("message", messageHandler);
            resolve(token);
          }
        };

        window.addEventListener("message", messageHandler);
      }
    }

    // TODO: Remove this default token
    if (!token) {
      resolve(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMFliYTh6aW5HdW8wRUtXWW40bCIsInVzZXJuYW1lIjoiUnVkb2xwaDg1QHlhaG9vLmNvbSIsImlhdCI6MTcyMjg4NDI0MiwiZXhwIjoxNzIyODg1MTQyfQ.xQlRr4BEcSty-ZSZX2WfuSsg8Jyaq97yvkp_s5lmoFQ"
      );
    }
  });
}

export function getGameId(): Promise<string | null> {
  return new Promise((resolve) => {
    const gameId: string | null | undefined = getGameIdFromUrl();
    if (gameId) {
      resolve(gameId);
    }

    //  Game_config id for the demo game
    if (!gameId) {
      resolve("1OfYYkkvnWsn2D748qrx");
    }
  });
}

export const notify = (error: string) => {
  toast.error(error, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 2000,
  });
};
