import { Sprite, Container, Texture } from 'pixi.js';
import { SlotGlobalUtils } from '../../utils/slot-global-utils';
import { SlotWheelUtils } from '../utils/slot-wheel-utils';

export class SlotWheelSymbol extends Container {
    public symbolID: number;
    public symbolName: string;
    public sprite: Sprite
    public winBg: Sprite

    constructor(texture: string) {
        super();

        this.winBg = new Sprite(Texture.from(SlotWheelUtils.REEL_WIN_BG_TEXTURE))
        this.winBg.scale.set(SlotGlobalUtils.scale);
        this.winBg.visible = false;
        this.addChild(this.winBg);

        this.sprite = new Sprite(Texture.from(texture));
        this.sprite.scale.set(SlotGlobalUtils.scale);
        this.addChild(this.sprite);
    }
}