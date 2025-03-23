import { SlotUserInterfaceUtils } from "../user_interface/utils/slot-user-interface-utils";
import { SlotWheelSymbol } from "../wheel/component/slot-wheel-symbol";
import * as _ from 'lodash'
import { SlotGameEventEmitter, SlotGameEvents } from "./slot-global-utils";
export class SlotWinningsHandler {
    protected winningSymbols: Array<SlotWheelSymbol> = [];
    constructor(){
        SlotGameEventEmitter.on(SlotGameEvents.SHOW_WINNINGS_ANIMATIONS,this.showSymbolWinningBackground.bind(this))
        SlotGameEventEmitter.on(SlotGameEvents.WINNINGS_DISPLAY_COMPLTE, this.onWinningsDisplayCompleted.bind(this))
    }
    /**
     * Used to handle the winnings, will return a value based on the meet conditions
     * @param winningsSymbols 
     */
    public handleWinnings(winningsSymbols: Array<number>): number {
        let value: number = 0;
        // Check for all three symbols matching
        if (winningsSymbols[0] === winningsSymbols[1] && winningsSymbols[1] === winningsSymbols[2]) {
            value = 3 * SlotUserInterfaceUtils.BET_VALUE;
        // Check for symbol pairs
        } else if(winningsSymbols[0] === winningsSymbols[1] ||
            winningsSymbols[0] === winningsSymbols[2] ||
            winningsSymbols[1] === winningsSymbols[2]
        ){
            value = 2 * SlotUserInterfaceUtils.BET_VALUE;
        }
        return value;
    }

    /**
    * Used to show the winnings background for each type of winning
    * @param symbols 
    */
    protected showSymbolWinningBackground(symbols: Array<SlotWheelSymbol>) : void {
        this.winningSymbols = symbols;
        if(symbols[0].symbolID === symbols[1].symbolID && symbols[1].symbolID === symbols[2].symbolID){ 
            _.forEach(symbols,(symbol)=>{
                symbol.winBg.visible = true;
            })
        }
        if(symbols[0].symbolID === symbols[1].symbolID){
            symbols[0].winBg.visible = true;
            symbols[1].winBg.visible = true;
        }
        if(symbols[0].symbolID === symbols[2].symbolID){
            symbols[0].winBg.visible = true;
            symbols[2].winBg.visible = true;
        } 
        if(symbols[1].symbolID === symbols[2].symbolID) {
            symbols[1].winBg.visible = true;
            symbols[2].winBg.visible = true;
        }  
    }

    /**
     * Handler for when winnings are completed
     */
    protected onWinningsDisplayCompleted(): void {
        _.forEach(this.winningSymbols,(symbol)=>{
            symbol.winBg.visible =false;
        })
        this.winningSymbols = [];
    }
}