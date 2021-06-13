export const lerp = (a, b, n) => (1 - n) * a + n * b;

export const setValueProgress = (start, end, progress) => {
    return start + (progress * (end - start));
}

export const getHypotenuse = (x, y) => {
    return Math.sqrt(
        Math.pow(x, 2) + Math.pow(y, 2)
    );
}

export const createElement = (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;

    return newElement.firstElementChild;
};

export function forwardZero(num) {
    return num < 10 ? `0${num}` : num;
}
