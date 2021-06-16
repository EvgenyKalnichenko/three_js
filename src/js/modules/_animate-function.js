export const animateEasing = (render, duration, easing) => new Promise(resolve => {
    let start = Date.now();

    (function loop() {
        let p = (Date.now() - start) / duration;

        if(p > 1) {
            //конец анимации
            resolve();
        }else{
            //отрисовка анимации
            requestAnimationFrame(loop);
            render(easing(p))
        }
    }());
});
