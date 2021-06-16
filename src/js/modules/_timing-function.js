//https://easings.net/ru - добавить можно отсюда

export const line = (x) => {
    return x;
};

export const easeInSine = (x) => {
    return 1 - Math.cos((x * Math.PI) / 2);
};

export const easeInQuart = (x) => {
    return x * x * x * x;
}

export const easeInCubic = (x) => {
    return x * x * x;
};

export const easeOutQuart = (x) =>  {
    return 1 - Math.pow(1 - x, 4);
};

export const easeInElastic = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
        ? 0
        : x === 1
            ? 1
            : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
};

export const easeInOutElastic = (x) => {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5
                ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
};

export const easeOutBounce = (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}