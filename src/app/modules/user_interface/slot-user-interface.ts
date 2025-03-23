import {Container, Point, Text, Texture} from 'pixi.js';
import { ButtonTextures, SlotUserInterfaceUtils } from './utils/slot-user-interface-utils';
import { SlotGlobalUtils } from '../utils/slot-global-utils';
import { SlotSpinButton } from './components/slot-spin-button';
import { ButtonStateEnum } from './utils/slot-user-interface-utils'
import { SlotGameEventEmitter } from '../utils/slot-global-utils';
import { SlotGameEvents } from '../utils/slot-global-utils'
import * as _ from 'lodash'
import { gsap } from 'gsap'
import { SlotWinningsHandler } from '../utils/slot-winnings-handler';
export class SlotUserInterface extends Container {
    protected balanceText: Text;
    protected betText: Text;
    protected winText: Text;

    protected spinButton: SlotSpinButton;
    protected currentState: ButtonStateEnum;

    protected balanceValue: number = SlotUserInterfaceUtils.BALANCE_VALUE;
    protected betValue: number =SlotUserInterfaceUtils.BET_VALUE;
    protected slotWinningsHandler: SlotWinningsHandler;

    /**
     * Constructor for the slot user interface
     */
    constructor() {
        super();
        this.initUI()
        SlotGameEventEmitter.on(SlotGameEvents.WHEEL_SPIN_COMPLETE, this.onWheelSpinComplete.bind(this));
        SlotGameEventEmitter.on(SlotGameEvents.ON_GAME_RESIZED, this.onResize.bind(this));
    }

    

    /**
     * Initializes the user interface and text elements
     */
    protected initUI(): void {
        this.balanceText = this.createTextField(this.balanceText, `BALANCE: ${this.balanceValue}$`, new Point(50, SlotGlobalUtils.gameHeight - 50));
        this.betText = this.createTextField(this.betText, `BET: ${this.betValue}$`, new Point(SlotGlobalUtils.gameWidth - 150, SlotGlobalUtils.gameHeight - 50));
        this.winText = this.createTextField(this.winText, "", new Point(SlotGlobalUtils.gameWidth / 2, SlotGlobalUtils.gameHeight - 50));
        this.createSpinButton();
     }

     /**
      * Creates the spin button
      */
    protected createSpinButton(): void {
        this.spinButton = new SlotSpinButton(Texture.from(ButtonTextures.PLAY));
        this.spinButton.setupTextures(ButtonTextures.PLAY, ButtonTextures.STOP, ButtonTextures.DISABLED);
        this.spinButton.scale.set(SlotGlobalUtils.scale)
        this.spinButton.anchor.set(0.5);
        this.positionSpinButton();
        this.spinButton.setButtonInteractivity(true);
        this.spinButton.addButtonListener(this.onButtonClick.bind(this))
        this.addChild(this.spinButton);
        this.spinButton.setButtonState(ButtonStateEnum.Play);
        this.currentState = ButtonStateEnum.Play;
     }

     /**
      * Used to position the spin button
      */
     protected positionSpinButton(): void {
        this.spinButton.x = SlotGlobalUtils.gameWidth - this.spinButton.width;
        this.spinButton.y = SlotGlobalUtils.gameHeight / 2 - (this.spinButton.height / 2);
     }

     /**
      * Method used to create a text field and add it to the container
      * @param textfield @
      * @param text 
      * @param position 
      */
    protected createTextField(textfield: Text,text: string, position: Point): Text {
        textfield = new Text('', SlotUserInterfaceUtils.textStyle);
        textfield.text = text;
        this.positionTextField(textfield, position);
        this.addChild(textfield);
        return textfield;
   }

    /**
    * Used to position a text field
    * @param textfield 
    */
    protected positionTextField(textfield: Text, position: Point): void {
        textfield.x = position.x;
        textfield.y = position.y;
    }

     /**
      * Updates the balance text field with a new value
      * @param value 
      */
    public updateBalance(value: number):void{
        this.balanceText.text =  `BALANCE: ${value}$`
    }

    /**
     * Updates the win text field with a new value
     * @param value 
     */
    public updateWin(value: number): void {
        let newText: string = "";
        if(value > 0){
            newText = `WIN: ${value}$`;
        } else if (value == 0) {
            newText = 'NO WINNINGS :('
        }
        this.winText.text = newText;
    }

    /**
     * Used to reset the win display
     */
    protected resetWin(): void {
        this.winText.text = '';
        if(this.balanceValue === 0){
            this.winText.text = 'NOT ENOUGH MONEY'
        }
    }

    /**
     * Button click handler
     */
    protected onButtonClick(): void {
        switch(this.currentState) {
            case ButtonStateEnum.Play: {
                if(this.balanceValue - this.betValue >= 0) {
                    this.balanceValue -= this.betValue;
                    this.currentState = ButtonStateEnum.Stop;
                    this.spinButton.setButtonState(ButtonStateEnum.Stop);
                    SlotGameEventEmitter.emit(SlotGameEvents.START_WHEEL_SPIN);
                } else {
                    // If there is not enough money to play
                    // Disable the spin button and update win text field with a new message
                    this.currentState = ButtonStateEnum.Disabled;
                    this.spinButton.setButtonState(ButtonStateEnum.Disabled);
                    this.spinButton.setButtonInteractivity(false);
                    this.updateWin(0);
                }
                break;
            }
            case ButtonStateEnum.Stop: {
                this.currentState = ButtonStateEnum.Disabled;
                this.spinButton.setButtonState(ButtonStateEnum.Disabled)
                SlotGameEventEmitter.emit(SlotGameEvents.STOP_WHEEL_SPIN);
                break;
            }
            case ButtonStateEnum.Disabled: {
                break;
            }
        }
        this.updateBalance(this.balanceValue);
    }

    /**
     * Handler for wheel spin animation complete
     * @param value 
     */
    protected onWheelSpinComplete(winningSymbols: Array<number>): void {
        this.currentState= ButtonStateEnum.Disabled;
        this.spinButton.setButtonState(ButtonStateEnum.Disabled);
        this.displayWinnings(winningSymbols);
    }

    /**
     * Used to update the spin button to the correct button state, based on balance
     */
    protected updateSpinButton(): void {
        if(this.balanceValue > 0){
            this.currentState = ButtonStateEnum.Play
            this.spinButton.setButtonState(ButtonStateEnum.Play);
        } else {
            this.currentState = ButtonStateEnum.Disabled;
            this.spinButton.setButtonState(ButtonStateEnum.Disabled);
            this.spinButton.setButtonInteractivity(false);
        }
    }

    /**
     * Processes winnings based on matching symbols
     * @param winningsSymbols Array of symbols from the spin
     */
    protected displayWinnings(winningsSymbols: Array<number>): void {
        if(_.isNil(this.slotWinningsHandler)){
            this.slotWinningsHandler = new SlotWinningsHandler();
        }
        const winValue: number = this.slotWinningsHandler.handleWinnings(winningsSymbols)
        this.updateWin(winValue);
        
        if (winValue > 0) {
            this.balanceValue += winValue;
            this.updateBalance(this.balanceValue);
        }

        // Reset the UI after displaying winnings
        const duration: number = winValue > 0 ? SlotUserInterfaceUtils.WINNINGS_DISPLAY_TIME : 
        SlotUserInterfaceUtils.NO_WINNINGS_TIME;
        gsap.delayedCall(duration, () => {
            this.updateSpinButton();
            this.resetWin();
            SlotGameEventEmitter.emit(SlotGameEvents.WINNINGS_DISPLAY_COMPLTE);
        });
    }

        /**
        * Method used when we are resizing the window
        */
        protected onResize(): void {
            this.positionSpinButton();
            this.positionTextField(this.balanceText, new Point(50, SlotGlobalUtils.gameHeight - 50));
            this.positionTextField(this.betText, new Point(SlotGlobalUtils.gameWidth - 150, SlotGlobalUtils.gameHeight - 50));
            this.positionTextField(this.winText, new Point(SlotGlobalUtils.gameWidth / 2, SlotGlobalUtils.gameHeight - 50));
        }
}