import SlotMachine from './lib/SlotMachine';
import SlotMachineCore from './lib/SlotMachineCore';
import { generateScoreContainer } from './scoreContainer';
import { generateButton, generateDisableButton } from './buttons';
import { generateMessageContainer } from './messageContainer';

const app = new SlotMachine({ 
    width: 960,         
    height: 536,        
    antialias: true,    
    transparent: false, 
    resolution: 1,
    atlas: 'atlas/slot-machine-atlas.json',
    atlasRefs: ['SYM0.png', 'SYM1.png', 'SYM2.png', 'SYM3.png', 'SYM4.png', 'SYM5.png'],
    root: document.getElementById('root'),
    setup: setup     
});

const WIN_CASE = 100;
const LOSE_CASE = 10;
const INITIAL_SCORE = 100; // 200 by default

function setup() {
    const REEL_WIDTH = 235;
    const SYMBOL_SIZE = 150;
    const LEFT_PADDING = 110;
    const TOP_PADDING = 30;

    const background = SlotMachineCore.createElement('Background', 'BG.png');
    app.renderElement(background);

    const reelContainer = SlotMachineCore.createElement(
        'Reels',
        null,
        { LEFT_PADDING, TOP_PADDING, REEL_WIDTH, SYMBOL_SIZE }
    );
    app.renderElement(reelContainer);

    const { 
        container: scoreContainer, 
        moneyTextCount, 
        winTextCount 
    } = generateScoreContainer(INITIAL_SCORE);
    app.renderElement(scoreContainer);

    const winContainer = generateMessageContainer(
        'You won!', TOP_PADDING, REEL_WIDTH, SYMBOL_SIZE
    );
    app.renderElement(winContainer);

    const loseContainer = generateMessageContainer(
        'You lose :(', TOP_PADDING, REEL_WIDTH, SYMBOL_SIZE
    );
    app.renderElement(loseContainer);

    const disabledButton = generateDisableButton();
    app.renderElement(disabledButton);

    const button = generateButton(() => {
        startReel(button, winContainer, loseContainer, moneyTextCount, winTextCount);
    });
    app.renderElement(button);

    SlotMachineCore.animateReel(app.app, SYMBOL_SIZE);    
}

function startReel(button, winContainer, loseContainer, moneyTextCount, winTextCount) {
    fetch('/reel-spin')
        .then(response => response.json())
        .then(data => {
            button.visible = false;
            
            if (winContainer.visible) {
                winContainer.visible = false;
            }

            SlotMachineCore.reel(data.extra, () => {
                onCompleteReel(button, winContainer, loseContainer, moneyTextCount, winTextCount);
            });
        });
}

function onCompleteReel(button, winContainer, loseContainer, moneyTextCount, winTextCount) {
    button.visible = true;

    const isWin = SlotMachineCore.checkReelResult();

    if (isWin) {
        moneyTextCount.text = '$' + updateScore(WIN_CASE, moneyTextCount.text);
        winTextCount.text = updateScore(1, winTextCount.text);

        winContainer.visible = true;       
    } else {
        const moneyIntCount = updateScore(-LOSE_CASE, moneyTextCount.text);

        moneyTextCount.text = '$' + moneyIntCount;
        
        if (moneyIntCount <= 0) {
            loseContainer.visible = true;
            button.visible = false;
        }
    }
}

function updateScore(value, text) {
    if (text.includes('$')) {
        text = text.replace('$', '');
    }

    const int = parseInt(text);

    return int +  value;
}
