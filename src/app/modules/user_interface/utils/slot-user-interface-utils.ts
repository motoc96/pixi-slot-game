import { TextStyle } from "pixi.js";

export class SlotUserInterfaceUtils {
    public static BALANCE_VALUE: number = 100;
    public static BET_VALUE: number = 1;
    public static WINNINGS_DISPLAY_TIME: number = 2;
    public static NO_WINNINGS_TIME: number = 1;
    public static textStyle: TextStyle = new TextStyle({
        fontFamily: "Noto Sans",
        fontSize: 24,
        fill: "white",
    });
}


export class ButtonTextures {
    public static PLAY: string = "assets/PLAY.png";
    public static STOP: string = "assets/STOP.png";
    public static DISABLED: string = "assets/PLAY_DISABLED.png";
}
export enum ButtonStateEnum {
    Play,
    Stop,
    Disabled,
}