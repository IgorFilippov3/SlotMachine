import * as PIXI from 'pixi.js';
import { backout, lerp, isAllElementsEqual } from './utils';

let Resources  = PIXI.loader.resources,
    Loader     = PIXI.loader,
    Sprite     = PIXI.Sprite,
    Container  = PIXI.Container,
    Graphics   = PIXI.Graphics,
    BlurFilter = PIXI.filters.BlurFilter,
    pText      = PIXI.Text;

const SlotMachineCore = {
    atlas: '',
    atlasRefs: [],
    tweening: [],
    reels: [],

    loadAssets(atlas, atlasRefs, setup) {
        this.atlas = atlas;
        this.atlasRefs = atlasRefs;

        Loader
            .add(this.atlas)
            .load(setup);
    },
    /*
    * Creates PIXI Element 
    * 
    * @param {String} type
    * @param {String | null} src
    * @param {Object} options - options properties depends on the method
    * 
    * @returns {PIXI.Sprite | PIXI.Text | PIXI.Container | PIXI.Graphics}
    */ 
    createElement(type, src, options) {
        if (!this.atlas) {
            throw 'Atlas schema must be insterted before creating elements.';
        }
        
        const id = Resources["atlas/slot-machine-atlas.json"].textures;
        
        switch (type) {
            case 'Background':
                return this.createBackground(id, src, options);
            case 'Button':
                return this.createButton(id, src, options);    
            case 'Reels':
                return this.createReels(id, options);
            case 'Container':
                return this.createContainer(options);
            case 'Text': 
                return this.createText(options);            
            default:
                throw 'Element type must be specified.';    
        }
    },
    /*
    * @param {Object} options
    * @param {String | Number} options.name
    * @param {Number} options.x
    * @param {Number} options.y
    * @param {Object | PIXI.TextStyle} options.style
    * 
    * @param {Object} options.anchor
    * @param {Number} options.anchor.x
    * @param {Number} options.anchor.y
    * 
    * @returns {PIXI.Text} text
    */
    createText(options) {
        const { name, style, x, y, anchor } = options;
        const text = new pText(name, style);
        text.x = x;
        text.y = y;
        if (anchor) {
            text.anchor.x = anchor.x;
            text.anchor.y = anchor.y;
        }

        return text;
    },
    /*
    * @param {Object} options
    * @param {Number} options.x
    * @param {Number} options.y
    * @param {Number} options.width
    * @param {Number} options.height
    * 
    * @returns {PIXI.Container} container
    */ 
    createContainer(options) {
        const container = new Container();
        const { x, y, width, height } = options;
        container.x = x;
        container.y = y;
        container.width = width;
        container.height = height;

        return container;
    }, 
    /*
    * @param {Object | PIXI.Resource} id
    * @param {String} src
    * @param {Object} options
    * @param {Number} options.color
    * @param {Number} options.alpha
    * @param {Number} options.x
    * @param {Number} options.y
    * @param {Number} options.width
    * @param {Number} options.height
    * 
    * @returns {PIXI.Sprite | PIXI.Graphics} background
    */
    createBackground(id, src, options) {
        if (src) {
            return new Sprite(id[src]);
        }

        const { color, alpha, x, y, width, height } = options;
        const background = new Graphics();
        background.beginFill(color, alpha);
        background.drawRect(x, y, width, height);
        background.endFill();

        return background;
        
    },
    /*
    * @param {Object | PIXI.Resource} id
    * @param {String} src
    * @param {Object} options
    * @param {Number} options.anchor
    * @param {Boolean} options.interactive
    * @param {Boolean} options.buttonMode
    * @param {Function} options.callback
    * 
    * @param {Object} options.position
    * @param {Number} options.position.x
    * @param {Number} options.position.y
    *    
    * @returns {PIXI.Sprite} button
    */
    createButton(id, src, options) {
        const { position, anchor, interactive, buttonMode, callback } = options;
        const button = new Sprite(id[src]);

        if (position) button.position.set(position.x, position.y);
        if (anchor) button.anchor.set(anchor);
        if (interactive) button.interactive = interactive;
        if (buttonMode) button.buttonMode =  buttonMode;
        if (callback) button.on('pointerdown', callback);

        return button;     
    },
    /*
    * @param {Object | PIXI.Resource} id
    * @param {String} src
    * 
    * @returns {PIXI.Container} reelContainer
    */
    createReels(id, src) {
        const { 
            LEFT_PADDING, TOP_PADDING, 
            REEL_WIDTH, 
            SYMBOL_SIZE
        } = src;

        const reelContainer = new Container();
        
        reelContainer.x = LEFT_PADDING;
        reelContainer.y = TOP_PADDING;

        for(let i = 0; i < 3; i++) {
            let rc = new Container();
            rc.x = i * REEL_WIDTH;

            switch(i) {
                case 0:
                    rc.x = i * REEL_WIDTH;
                    break;
                case 1:
                    rc.x = i * REEL_WIDTH + 5;
                    break;
                case 2:
                    rc.x = i * REEL_WIDTH + 14;
                    break;
                default:
                    throw 'Behavior is specified only for 3 reels, by default'        
            }

            reelContainer.addChild(rc);

            let reel = {
                container: rc,
                symbols:[],
                position: 0,
                previousPosition: 0,
                blur: new BlurFilter()
            };
            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];

            for(let k = 0; k < 5; k++) {
                let symbol = this.createSymbol(k, SYMBOL_SIZE, id);

                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            this.reels.push(reel);
        }
        return reelContainer;    
    },
    /*
    * @param {Number} index
    * @param {Number} SYMBOL_SIZE
    * @param {Object | PIXI.Resource} id
    * 
    * @returns {PIXI.Sprite} symbol
    */
    createSymbol(index, SYMBOL_SIZE, id) {
        let randomNumber = Math.floor(Math.random()*this.atlasRefs.length);
        let symbol = new Sprite(id[this.atlasRefs[randomNumber]]);

        if (symbol._texture.textureCacheIds[0] === 'SYM0.png') {
            symbol.scale.x = 0.8;
            symbol.scale.y = 0.8;
            symbol.y = 0;
        } 

        symbol.y = index * SYMBOL_SIZE;
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width ) / 2);

        return symbol;
    },
    /*
    * @param {Number} condition
    * @param {Function} onComplete
    */
    reel(condition, onComplete) {
    
        for(let i = 0; i < this.reels.length; i++) {
            let r = this.reels[i];
            let callback = null;

            if (i === this.reels.length - 1) {
                callback = onComplete;
            }
            
            SlotMachineCore.tweenTo(
                r, 
                "position",
                r.position + 10 + i * 3 + condition, 
                1500 + i * 600 + condition * 600, 
                backout(0.6),
                null, 
                callback
            );
        }
    },
    /*
    * @param {PIXI.Application} app
    * @param {Number} SYMBOL_SIZE
    * 
    * @returns {void}
    */
    animateReel(app, SYMBOL_SIZE) {
        app.ticker.add(() => {
            //Update the slots.
            for(let i = 0; i < this.reels.length; i++) {
                let r = this.reels[i];
                //Update blur filter y amount based on speed.
                
                r.blur.blurY = (r.position - r.previousPosition) * 8;
                r.previousPosition = r.position;
                
                //Update symbol positions on reel.
                for(let j = 0; j < r.symbols.length; j++) {
                    let s = r.symbols[j];
                    let prevy = s.y;
                    s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;

                    if (s._texture.textureCacheIds[0] === 'SYM0.png') {
                        s.y += 18;
                    }

                    if(s.y < 0 && prevy > SYMBOL_SIZE){
                        s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                    }
                }
            }

            let now = Date.now();
            let remove = [];
            for(let i = 0; i < this.tweening.length; i++) {
                let t = this.tweening[i];
                let phase = Math.min(1,(now - t.start) / t.time);
                
                t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
                if(t.change) {
                    t.change(t);
                }
                if(phase == 1) {
                    t.object[t.property] = t.target;
                    if(t.complete) {
                        t.complete(t);
                    }
                        
                    remove.push(t);
                }
            }
            for(let i = 0; i < remove.length; i++) {
                this.tweening.splice(this.tweening.indexOf(remove[i]),1);
            }    
        });
    },
    /*
    * @param {Object} object
    * @param {PIXI.filters.BlurFilter} object.blur
    * @param {PIXI.Container} object.container
    * @param {Number} object.position
    * @param {Number} object.previousPosition
    * @param {Sprite[]} object.symbols
    * 
    * @param {String} property
    * @param {Number} target
    * @param {Number} time
    * @param {Function} easing
    * @param {Function | null} onchange
    * @param {Function} oncomplete
    */
    tweenTo(object, property, target, time, easing, onchange, oncomplete) {
       	const tween = {
            object: object,
            property: property,
            propertyBeginValue: object[property],
            target: target,
            easing: easing,
            time: time,
            change: onchange,
            complete: oncomplete,
            start: Date.now()
	    };

        this.tweening.push(tween);
    },
    /*
    * @returns {Boolean} isWin
    */
    checkReelResult() {
        const targetSymbols = this.reels.reduce((acc, curr) => {
            const targetSymbol = curr.container.children.find(symbol => {
                return Math.floor(symbol.y) > 120 && Math.floor(symbol.y) < 200;
            });

            if (!targetSymbol) {
                return [...acc, null];
            }

            return [...acc, targetSymbol._texture.textureCacheIds[0]];
        }, []);

        const isWin = isAllElementsEqual(targetSymbols);

        return isWin;
    }
}

export default SlotMachineCore;