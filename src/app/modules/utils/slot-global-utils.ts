import EventEmitter from "eventemitter3";

export class SlotGlobalUtils {
    public static gameWidth: number;
    public static gameHeight: number;
    public static scale: number = 1
}

export const SlotGameEventEmitter = new EventEmitter();

export class SlotGameEvents {
    public static START_WHEEL_SPIN: string = 'start_wheel_spin_event';
    public static STOP_WHEEL_SPIN: string ='stop_wheel_spin_event';
    public static WHEEL_SPIN_COMPLETE: string = 'wheel_spin_complete_event'
    public static SHOW_WINNINGS_ANIMATIONS: string = 'show_winnings_animations_event';
    public static WINNINGS_DISPLAY_COMPLTE: string = 'wheel_display_complete_event'

    public static ON_GAME_RESIZED: string ='game_resized_event'
}