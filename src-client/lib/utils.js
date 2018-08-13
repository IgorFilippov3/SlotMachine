//https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
export const backout = amount => t => {
    return (--t * t * ((amount + 1) * t + amount) + 1);
}

export const lerp = (a1, a2, t) => {
    return a1 * (1 - t) + a2 * t;
};

export const isAllElementsEqual = array => {
    const set = new Set(array);
    return set.size === 1;
};

