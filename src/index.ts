import { IApplicationOptions } from "pixi.js";
import { SlotGame } from "./app/slot-game";
import "./styles/main.css";
console.log("Creating new SlotGame instance");
const appSettings : IApplicationOptions = {
    width: 1920,
    height: 1080,
    transparent: false,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio,
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