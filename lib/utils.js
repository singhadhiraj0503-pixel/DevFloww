import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getDevIconClassName = (techName) => {
  if (!techName) {
    console.log("techName is undefined:", techName);
    return "devicon-devicon-plain";
  }

  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};
