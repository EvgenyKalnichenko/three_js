import Swiper from "swiper";
import Sketch from "./_Sketch";
import gsap from 'gsap';

$(function () {

    const sketch = new Sketch();

    const renderProgress = (p) => {
        sketch.settings.progress = p;
    };

    const renderMove = (p) => {
        sketch.move = 1 - p;
    };

    const animateDurationStart = (render, duration, nextFunction) => new Promise(resolve => {
        let start = Date.now();
        sketch.move = 1;
        (function loop() {
            let p = (Date.now() - start) / duration;

            if(p > 0.7){
                nextFunction();
            }
            if(p > 1) {
                resolve();
            }else{
                //отрисовка анимации
                requestAnimationFrame(loop);
                sketch.settings.progress = 1 - p;
                sketch.move =  1 - p;
            }
        }());
    });

    const power = (n, timeFraction) => {
      return Math.pow(timeFraction, n)
    };

    const animateDurationEnd = (render, duration, nextFunction) => new Promise(resolve => {
        let start = Date.now();
        sketch.move = 1;
        (function loop() {
            let p = (Date.now() - start) / duration;

            if(p > 1) {
                resolve();
                sketch.settings.progress = 1;
            }else{
                //отрисовка анимации
                requestAnimationFrame(loop);
                sketch.settings.progress = p;
            }
        }());
    });

    const mainSwiper = new Swiper('.main-slider__container', {
        slidesPerView: 1,
        watchSlidesProgress: true,
        on: {
            slideChange: function () {
                animateDurationStart(renderMove, 400, ()=>{
                    animateDurationEnd(renderProgress, 200)
                });
            },
            slideNextTransitionStart: function () {
                sketch.nextTexture = $('.swiper-slide-next').attr('data-texture') || $('.swiper-slide-prev').attr('data-texture');
                sketch.currentTexture = $('.swiper-slide-active').attr('data-texture');

                console.log(sketch.nextTexture, sketch.currentTexture);
                setTimeout(function () {
                    sketch.loadTexture();
                }, 400)

            },
            slidePrevTransitionStart:function () {

                sketch.nextTexture = $('.swiper-slide-active').attr('data-texture');
                sketch.loadTexture();

                console.log(sketch.nextTexture, sketch.currentTexture);

                setTimeout(function () {
                    sketch.currentTexture = $('.swiper-slide-active').attr('data-texture');
                    sketch.loadTexture();
                }, 400)
            },
        }
    });
});


