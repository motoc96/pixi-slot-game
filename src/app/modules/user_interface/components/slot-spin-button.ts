import { Sprite, Texture } from "pixi.js";
import { ButtonStateEnum } from "../utils/slot-user-interface-utils";

export class SlotSpinButton extends Sprite {
    protected playTexture: Texture;
    protected stopTexture: Texture;
    protected disabledTexture: Texture;
    protected textureArray: Array<Texture> = [];
    protected buttonState: ButtonStateEnum = ButtonStateEnum.Play;

    constructor(texture?: Texture) {
        super(texture);
    }

    /**
     * Sets up the textures for the button
     * @param playTexture 
     * @param stopTexture 
     * @param disabledTexture 
     */
    public setupTextures(playTexture: string, stopTexture: string, disabledTexture: string): void {
        this.playTexture = Texture.from(playTexture);
        this.stopTexture = Texture.from(stopTexture);
        this.disabledTexture = Texture.from(disabledTexture);
        this.textureArray.push(this.playTexture, this.stopTexture, this.disabledTexture);
    }

    /**
     * Sets a new button state
     * @param state 
     */
    public setButtonState(state: ButtonStateEnum): void {
        this.buttonState = state;
        this.texture = this.textureArray[state];
    }

    /**
     * Used to add click function on the button
     * @param callback 
     */
    public addButtonListener(callback: Function): void {
        this.addListener('pointerup', callback.bind(this));
    }

    /**
     * Sets button interactivity enabled/disabled
     * @param enabled 
     */
    public setButtonInteractivity(enabled: boolean): void {
        this.interactive = enabled;
        this.accessible = enabled;
        this.buttonMode = enabled;
        this.cursor = enabled ? 'pointer' : 'none';
    }
}