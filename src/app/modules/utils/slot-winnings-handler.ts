import { SlotUserInterfaceUtils } from "../user_interface/utils/slot-user-interface-utils";

export class SlotWinningsHandler {
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
}