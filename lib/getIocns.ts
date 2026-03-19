import random1 from "../static/projects/random1.svg";
import random2 from "../static/projects/random2.svg";
import random3 from "../static/projects/random3.svg";

export const PROJECT_ICONS = [
random1,
random2,
random3
];

export function getRandomProjectIcon() {
  return PROJECT_ICONS[Math.floor(Math.random() * PROJECT_ICONS.length)];
}