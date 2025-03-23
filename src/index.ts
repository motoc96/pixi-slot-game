import { IApplicationOptions } from "pixi.js";
import { SlotGame } from "./app/slot-game";
import "./styles/main.css";
console.log("Creating new SlotGame instance");
const appSettings : IApplicationOptions = {
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: false,
    backgroundColor: 0x000000,
    view: document.getElementById('game-canvas') as HTMLCanvasElement
}
// Prevent multiple instances during HMR
declare global {
    var __SLOT_GAME__: SlotGame | undefined;
}

if (!globalThis.__SLOT_GAME__) {
    globalThis.__SLOT_GAME__ = new SlotGame(appSettings);
}
console.log("SlotGame instance created");