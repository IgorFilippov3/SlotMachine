import SlotMachineCore from './lib/SlotMachineCore';

export const generateMessageContainer = (message, TOP_PADDING, REEL_WIDTH, SYMBOL_SIZE) => {
    const container = SlotMachineCore.createElement(
        'Container',
        null,
        { x: 70, y: TOP_PADDING, width: (REEL_WIDTH + 4) * 3, height: SYMBOL_SIZE * 2.5 }
    );
    container.visible = false;;

    const containerBackground = SlotMachineCore.createElement(
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

    container.addChild(containerBackground);

    const textStyle = { 
        fill: '#ebef09',
        fontFamily: 'Arial',
        fontSize: 124,
        fontWeight: 'normal'
    };

    const text = SlotMachineCore.createElement(
        'Text',
        null,
        { 
            name: message, 
            style: textStyle, 
            x: containerBackground.width / 2, 
            y: containerBackground.height / 2,
            anchor: {
                x: 0.5, y: 0.5
            }
        }
    );
 
    container.addChild(text);

    return container;
};