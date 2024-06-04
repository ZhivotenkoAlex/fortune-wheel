import dairy_milk from "../assets/dairy_milk.png";
import rice_cake from "../assets/rice_cake.png";
import truffle_lindt from "../assets/truffle_lindt.png";

export const images: Record<string, string> = {
  dairy_milk: dairy_milk,
  rice_cake: rice_cake,
  truffle_lindt: truffle_lindt,
};

export function isEmpty(obj: Record<string, any>) {
  obj = obj || {};
  return Object.keys(obj).length === 0;
}
