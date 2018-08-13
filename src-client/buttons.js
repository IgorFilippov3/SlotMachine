import SlotMachineCore from './lib/SlotMachineCore';

export const generateButton = callback => {
    return SlotMachineCore.createElement(
        'Button',
        'BTN_Spin.png',
        {
            position: { x: 873, y: 267 },
            anchor: 0.5,
            interactive: true,
            buttonMode: true,
            callback: callback
        }
    );
};

export const generateDisableButton = () => {
    return SlotMachineCore.createElement(
        'Button', 
        'BTN_Spin_d.png',
        {   position: { x: 873, y: 267 },
            anchor: 0.5
        }
    );
};