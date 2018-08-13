import SlotMachineCore from './lib/SlotMachineCore';

export const generateScoreContainer = (money = 200) => {
    const container = SlotMachineCore.createElement(
        'Container', 
        null, 
        { x: 798, y: 350, width: 150, height: 70 }
    );

    const background = SlotMachineCore.createElement(
        'Background',
        null,
        { 
            color: 0x000000, 
            alpha: 0.5,
            x: 0,
            y: 0, 
            width: container._width, 
            height: container._height 
        }
    );

    const moneyContainer = SlotMachineCore.createElement(
        'Container',
        null,
        { x: 4, y: 4, width: 0, height: 0 }
    );

    const textStyle = { 
        fill: '#ebef09',
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'normal'
    };

    const moneyText = SlotMachineCore.createElement(
        'Text', 
        null, 
        { name: 'MONEY :', style: textStyle, x: 0, y: 0 }
    );

    const moneyTextCount = SlotMachineCore.createElement(
        'Text',
        null,
        { name: '$' + money, style: textStyle, x: moneyText.width + 4, y: 0 }
    );

    moneyContainer.addChild(moneyText);
    moneyContainer.addChild(moneyTextCount);

    const winContainer = SlotMachineCore.createElement(
        'Container',
        null,
        { x: 4, y: 24, width: 0, height: 0 }
    );

    const winText = SlotMachineCore.createElement(
        'Text',
        null,
        { name: 'WIN :', style: textStyle, x: 0, y: 0 }
    );

    const winTextCount = SlotMachineCore.createElement(
        'Text',
        null,
        { name: 0, style: textStyle, x: winText.width + 4, y: 0 }
    );

    winContainer.addChild(winText);
    winContainer.addChild(winTextCount);

    container.addChild(background);
    container.addChild(moneyContainer);
    container.addChild(winContainer);
    
    return { container, moneyTextCount, winTextCount };
};