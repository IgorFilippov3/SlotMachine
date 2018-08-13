import * as PIXI from 'pixi.js';
import SlotMachineCore from './SlotMachineCore';

export default class SlotMachine {
    /*
    ** Represents a set of params to create a Slot Machine instance
    *
    * @param {Object}  options 
    * @param {Number}  options.width 
    * @param {Number}  options.height 
    * @param {Boolean} options.antialias
    * @param {Boolean} options.transparent
    * @param {Number}  options.resolution
    * @param {HTMLElement} options.root
    * @param {Function} options.setup
    */
    constructor(options) {
        this.app = this.createApp(options);
        this.loadAssets(options);
    }

    createApp(options) {
        const { width, height, antialias, transparent, resolution, root } = options;
        const app = new PIXI.Application(
            { width, height, antialias, transparent, resolution }
        );
        root.appendChild(app.view);
        return app;
    }

    loadAssets(options) {
        const { atlas, atlasRefs, setup } = options;
        SlotMachineCore.loadAssets(atlas, atlasRefs, setup);
    }

    /*
    * Attach PIXI Element to stage
    * @param {PIXI.Sprite | PIXI.Container | PIXI.Graphics | PIXI.Text}
    */

    renderElement(element) {
        const stage = this.app.stage;
        stage.addChild(element);
    }
}