export class SlotWheelUtils {
    public static REEL_BG_TEXTURE: string = "assets/REEL.png";
    public static REEL_WIN_BG_TEXTURE: string = "assets/WIN_BG.png";
    public static WHEEL_PADDING: number = 6;
    public static MINIMUM_SPIN_TIME: number = 3;
    public static QUICK_STOP_TIME: number = 0.3;
    public static WHEEL_SPEED: number = 40;
    public static SMOOTH_DURATION: number = 0.5;

    public static SYMBOL_IMAGES: Map<string, string> = new Map([
        ["SYM1", "assets/SYM01.png"],
        ["SYM2", "assets/SYM02.png"],
        ["SYM3", "assets/SYM03.png"],
        ["SYM4", "assets/SYM04.png"],
        ["SYM5", "assets/SYM05.png"],
        ["SYM6", "assets/SYM06.png"]
    ]);

    public static SYMBOL_ORDER: string = "SYM1,SYM5,SYM1,SYM3,SYM4,SYM3,SYM2,SYM4,SYM3,SYM6,SYM3,SYM1,SYM6,SYM1,SYM2,SYM1,SYM2,SYM2,SYM2,SYM1,SYM2,SYM1,SYM4,SYM1,SYM3,SYM6,SYM1,SYM3,SYM2,SYM5,SYM3,SYM1,SYM2,SYM2,SYM2,SYM1,SYM4,SYM1,SYM4,SYM1,SYM3,SYM2,SYM4,SYM4,SYM5,SYM2,SYM3,SYM1,SYM1,SYM1,SYM4,SYM5,SYM2,SYM2,SYM2,SYM1,SYM5,SYM6,SYM1,SYM3,SYM4,SYM2,SYM5,SYM2,SYM1,SYM5,SYM1,SYM2,SYM1,SYM1,SYM1,SYM4,SYM4,SYM3,SYM3,SYM5,SYM5,SYM4,SYM2,SYM5,SYM2,SYM1,SYM3,SYM2,SYM3,SYM1,SYM4,SYM3,SYM4,SYM2,SYM3,SYM4,SYM1,SYM1,SYM1,SYM2,SYM6,SYM3,SYM2,SYM3,SYM1,SYM5"
    public static SYMBOL_SIZE: number = 128;

}