import { Application, IApplicationOptions, Loader } from 'pixi.js';
import { SlotUserInterface } from './modules/user_interface/slot-user-interface';
import { SlotGlobalUtils } from './modules/utils/slot-global-utils';
import { ButtonTextures } from './modules/user_interface/utils/slot-user-interface-utils';
import { SlotWheel } from './modules/wheel/slot-wheels';
import { SlotWheelUtils } from './modules/wheel/utils/slot-wheel-utils';
import { SlotGameEventEmitter, SlotGameEvents } from './modules/utils/slot-global-utils';
// Extend globalThis to include __PIXI_APP__ DELETE THIS
declare global {
    var __PIXI_APP__: Application | undefined;
}

export class SlotGame extends Application {
    constructor(appSettings: IApplicationOptions) {
        super(appSettings);
        
        this.loader = new Loader();
        this.preloadAssets();
        window.addEventListener('resize', this.onResize.bind(this));
    }

    /**
     * Creates the slot game pixi application
     * @protected
     */
    protected createSlotGame(): void {
       SlotGlobalUtils.gameWidth = this.view.width;
       SlotGlobalUtils.gameHeight = this.view.height;
       // TO delete this after the game is done
       globalThis.__PIXI_APP__ = this;     
       this.createSlotUserInterface();
       this.createSlotWheel();
       // Perform an initial resize after the game is initialised 
       this.onResize();
    }

 /**
     * Preloads assets for the game
     */
    protected preloadAssets(): void {
        this.loader.add('playButton', ButtonTextures.PLAY);
        this.loader.add('stopButton', ButtonTextures.STOP);
        this.loader.add('disabledButton', ButtonTextures.DISABLED);
        this.loader.add('reelBackground',SlotWheelUtils.REEL_BG_TEXTURE);
        this.loader.add('reelWinBackground',SlotWheelUtils.REEL_WIN_BG_TEXTURE);
        SlotWheelUtils.SYMBOL_IMAGES.forEach((value: string, key: string) => {
            this.loader.add(key, value);
        });
        // Listen for the complete event
        this.loader.onComplete.add(this.onAssetsLoaded.bind(this));
        // Start loading
        this.loader.load();
    }

    /**
     * * Handles resizing the game canvas and content
     * */
    protected onResize(): void {
        // Get the new width and height of the window
        const newWidth = window.innerWidth ;
        const newHeight = window.innerHeight;
        
        this.renderer.resize(newWidth, newHeight);
        SlotGlobalUtils.gameWidth = newWidth;
        SlotGlobalUtils.gameHeight = newHeight;

        const scaleX = newWidth / this.view.width;
        const scaleY = newHeight / this.view.height;
        const scale = Math.min(scaleX, scaleY);
        this.stage.scale.set(scale);
        SlotGlobalUtils.scale = scale;

        this.stage.position.set(
            (newWidth - this.view.width * scale) / 2,
            (newHeight - this.view.height * scale) / 2
        );
        SlotGameEventEmitter.emit(SlotGameEvents.ON_GAME_RESIZED);
}

    /**
     * Callback for when the assets are loaded
     */
    protected onAssetsLoaded(): void {
        console.log('Assets loaded');
        this.createSlotGame();
    }

    /**
     * Creates the slot user interface
     * @protected
     */
    protected createSlotUserInterface():void {
        const slotUserInterface = new SlotUserInterface();
        this.stage.addChild(slotUserInterface);
    }

    /**
     * Creates the slot wheel
     * @protected
     */
    protected createSlotWheel(): void {
        const slotWheel = new SlotWheel(this.ticker);
        this.stage.addChild(slotWheel);
    }
}