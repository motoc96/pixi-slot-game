import { Sprite, Container, Graphics, Ticker } from "pixi.js";
import { SlotWheelUtils } from "./utils/slot-wheel-utils";
import { SlotGlobalUtils } from "../utils/slot-global-utils";
import { SlotWheelSymbol } from "./component/slot-wheel-symbol";
import { SlotGameEventEmitter } from "../utils/slot-global-utils";
import { SlotGameEvents } from "../utils/slot-global-utils"

import * as _ from 'lodash'
import { gsap } from "gsap";

export class SlotWheel extends Container {
    protected wheelBackgroundContainer: Container;
    protected reelBackground: Sprite;
    protected symbolsContainer: Container;
    protected symbolsContainerMask: Graphics
    protected allSymbols: Array<SlotWheelSymbol> = [];
    protected onDisplaySymbols: Array<SlotWheelSymbol> = [];

    protected totalSymbols: number = 4;
    protected isSpinning: boolean = false;
    protected spinSpeed: number = SlotWheelUtils.WHEEL_SPEED;

    protected startSpinAnimation: GSAPTimeline
    protected stopSpinAnimation:GSAPTimeline
    protected appTicker: Ticker

    /**
     * Constructor for the slot wheel
     * @param ticker 
     */
    constructor(ticker: Ticker) {
        super();
        this.initWheel();
        this.appTicker = ticker
    }

    /**
     * Initialize the wheel
     */
    protected initWheel(): void {
        // Create the reel background
        this.createReelBackgroundContainer();
        // Get all symbols
        this.getAllSymbols();
        // Initialize the symbols on display
        this.initSymbolsOnDisplay();
        SlotGameEventEmitter.on(SlotGameEvents.START_WHEEL_SPIN, this.startWheelSpin.bind(this));
        SlotGameEventEmitter.on(SlotGameEvents.STOP_WHEEL_SPIN,this.stopWheelSpin.bind(this));
        SlotGameEventEmitter.on(SlotGameEvents.ON_GAME_RESIZED, this.onResize.bind(this));
    }

    /**
     * Create the reel background container
     */
    protected createReelBackgroundContainer(): void {
        this.reelBackground = Sprite.from(SlotWheelUtils.REEL_BG_TEXTURE);
        this.reelBackground.scale.set(SlotGlobalUtils.scale);
        this.wheelBackgroundContainer = new Container();
        this.positionWheelBackground();
        this.wheelBackgroundContainer.addChild(this.reelBackground);
        this.addChild(this.wheelBackgroundContainer);
    }

    /**
     * Used to position wheel backround position
     */
    protected positionWheelBackground(): void {
        this.wheelBackgroundContainer.x = SlotGlobalUtils.gameWidth / 3;
        this.wheelBackgroundContainer.y = SlotGlobalUtils.gameHeight / 2.5 - (this.reelBackground.height / 2);
    }

    /**
     * Used to create all symbols array
     */
    protected getAllSymbols(): void {
        const allSymbols: string = SlotWheelUtils.SYMBOL_ORDER;
        const allSymbolsArray: Array<string> = allSymbols.split(",");
        for (let i = 0; i < allSymbolsArray.length; i++) {
            const symbolName: string = allSymbolsArray[i];
            const symbolTexture: string = SlotWheelUtils.SYMBOL_IMAGES.get(symbolName);
            const symbol: SlotWheelSymbol = new SlotWheelSymbol(symbolTexture);
            symbol.symbolName = symbolName;
            symbol.symbolID = Number(symbolName.charAt(symbolName.length-1));
            this.allSymbols.push(symbol);
        }
    }

    /**
     * Initialize the symbols on display
     */
    protected initSymbolsOnDisplay(): void {
        // Create the symbols container
        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);
        for (let i = 0; i < this.totalSymbols; i++) {
            const symbol: SlotWheelSymbol = this.allSymbols[i];
            symbol.y = i * symbol.height + SlotWheelUtils.WHEEL_PADDING / 2 ;
            this.onDisplaySymbols.push(symbol);
            this.symbolsContainer.addChild(symbol);
        }
        this.positionSymbolsContainer();
        this.addWheelMask();
    }

    /**
     * Used to set the symbols container position
     */
    protected positionSymbolsContainer(): void {
        this.symbolsContainer.position.x = this.wheelBackgroundContainer.position.x + SlotWheelUtils.WHEEL_PADDING;
        this.symbolsContainer.position.y = this.wheelBackgroundContainer.position.y + SlotWheelUtils.WHEEL_PADDING - SlotWheelUtils.SYMBOL_SIZE;
    }

    /**
     * Used to add a mask over the symbols container, in order to hide the extra symbols that are in the container
     */
    protected addWheelMask(): void {
        this.symbolsContainerMask = new Graphics();
        this.symbolsContainerMask.beginFill(0xFFFFFF);
        this.symbolsContainerMask.drawRect(0, 0, this.reelBackground.width - SlotWheelUtils.WHEEL_PADDING *2, this.reelBackground.height-SlotWheelUtils.WHEEL_PADDING * 2);
        this.symbolsContainerMask.endFill();
        this.positionSymbolsContainerMask();
        this.symbolsContainerMask.isMask = true;
        this.symbolsContainerMask.visible = true;
        this.addChild(this.symbolsContainerMask);
        this.symbolsContainer.mask = this.symbolsContainerMask;
    }

    /**
     * Used to set symbols container mask position
     */
    protected positionSymbolsContainerMask(): void {
        this.symbolsContainerMask.position.x = this.wheelBackgroundContainer.position.x + SlotWheelUtils.WHEEL_PADDING;
        this.symbolsContainerMask.position.y = this.wheelBackgroundContainer.position.y + SlotWheelUtils.WHEEL_PADDING;
    }

    /**
     * Moves the symbols inside the container
     */
    protected moveSymbols(): void {
        const symbolSize: number = SlotWheelUtils.SYMBOL_SIZE;
        _.forEach(this.onDisplaySymbols, (symbol, index) => {
            symbol.y += this.spinSpeed * this.appTicker.deltaTime;
            if (symbol.y >= this.symbolsContainer.height) {
                this.symbolsContainer.removeChild(symbol);
                this.onDisplaySymbols.splice(index, 1);
                // Get the next symbol and add it to the top
                const nextSymbol = this.getNextSymbol();
                nextSymbol.y = 0 ;
                this.symbolsContainer.addChild(nextSymbol);
                // Add the new symbol to the start of the array
                this.onDisplaySymbols.unshift(nextSymbol); 
                if(this.appTicker.deltaTime >= this.totalSymbols){
                    symbol.position.y = symbol.position.y - ((this.appTicker.deltaTime - this.totalSymbols) * symbolSize)
                }
            }
        });

    }

    /**
     * Starts the wheel spin animation
     */
    protected startWheelSpin(): void {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinSpeed = SlotWheelUtils.WHEEL_SPEED;
        this.startSpinAnimation = gsap.timeline();
        this.startSpinAnimation.to(this, {
            spinSpeed: this.spinSpeed, 
            duration: SlotWheelUtils.MINIMUM_SPIN_TIME, 
            ease: "linear", 
            onUpdate: () => {
                this.moveSymbols();
            },
            onComplete: () => {
                this.stopWheelSpin();
            },
        });
    }

    /**
     * Stops the wheel spin animation
     */
    protected stopWheelSpin(): void {
       if(!this.isSpinning) return;
        this.isSpinning = false;
        this.startSpinAnimation.kill();
        this.stopSpinAnimation = gsap.timeline();
        this.stopSpinAnimation.to(this, {
            spinSpeed: 0, 
            duration: SlotWheelUtils.QUICK_STOP_TIME,
            ease: "linear",
            onUpdate: () => {
                this.moveSymbols(); 
            },
            onComplete: () => {
                this.reelComplete(); 
            },
        });
    }

    /**
     * Smoothly aligns the symbols to their final positions
     */
    protected smoothAlignSymbols(callback: Function): void {
        const symbolSize: number = SlotWheelUtils.SYMBOL_SIZE;
        _.forEach(this.onDisplaySymbols, (symbol, index) => {
            const targetY = index * symbolSize; // Calculate the target position for each symbol
            gsap.to(symbol, {
                y: targetY , 
                duration:SlotWheelUtils.SMOOTH_DURATION, 
                ease: "power1.inOut", 
                onComplete: ()=> {
                    // callback only when the last symbol is aligned to the wheel
                    if(index == this.onDisplaySymbols.length-1){
                        callback();
                    }
                }
            });
        });
    }

    /**
     * Gets the next symbol in the sequence
     */
    protected getNextSymbol(): SlotWheelSymbol {
        if(this.allSymbols.length === 0){
            this.getAllSymbols();
        }
        return this.allSymbols.shift();
    }

    /**
     * Callback when the reel completes
     */
    protected reelComplete(): void {
        if (this.isSpinning){
            this.isSpinning = false;
        }
        this.smoothAlignSymbols(this.sendWheelCompleteSignal.bind(this));
    }

    /**
     * Used to send the wheel complete signal
     */
    protected sendWheelCompleteSignal(): void {
        const winningSymbolsID: Array<number> = [];
        const winningSymbols: Array<SlotWheelSymbol>= [ ];
        _.forEach(this.onDisplaySymbols, (symbol,index)=> {
            // If the position is bigger than 0, it means that the symbol is displayed in view
            if(symbol.position.y > 0 && symbol.y < this.symbolsContainer.height){
                winningSymbolsID.push(symbol.symbolID);
                winningSymbols.push(symbol);
            }
        })
        SlotGameEventEmitter.emit(SlotGameEvents.WHEEL_SPIN_COMPLETE, winningSymbolsID);
        SlotGameEventEmitter.emit(SlotGameEvents.SHOW_WINNINGS_ANIMATIONS, winningSymbols);
    }

    /**
     * Method used when we are resizing the window
     */
    protected onResize(): void {
        this.positionWheelBackground();
        this.positionSymbolsContainer();
        this.positionSymbolsContainerMask();
    }
}