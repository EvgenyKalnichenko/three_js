import Swiper from "swiper";
import Sketch from "./_Sketch";

import {line, easeOutQuart, easeOutBounce} from "./_timing-function";
import {animateEasing} from "./_animate-function";

$(function () {

    const sketch = new Sketch();

    const divide = (p) => {
        sketch.settings.progress = 1 - p;
    };

    const collect = (p) => {
        if(p >= 0.99) {
            sketch.settings.progress = 1;
        }else {
            sketch.settings.progress = p;
        }
    };

    const renderMove = (p) => {

        if(p >= 0.98) {
            sketch.move = 0;
        }else {
            sketch.move = 1 - p;
        }
    };

    let flag = true;

    const toggleImage = () => {
        animateEasing(divide,800, easeOutQuart);
        animateEasing(renderMove,1000, line);
        setTimeout(()=> {
            animateEasing(collect,1200, easeOutBounce);
        }, 800);

        setTimeout(()=>{
            flag = true;
        }, 1200)
    };

    const prevTexture = () => {
        let x = $('.swiper-slide-prev').attr('data-texture');
        console.log('prevTexture' , x);
        return x;
    };

    const activeTexture = () => {
        let x = $('.swiper-slide-active').attr('data-texture');
        console.log('activeTexture' , x);
        return x;
    };

    const nextTexture = () => {
        return $('.swiper-slide-next').attr('data-texture');
    };

    const mainSwiper = new Swiper('.main-slider__container', {
        slidesPerView: 1,
        watchSlidesProgress: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        on: {
            init: function (){
                sketch.loadTexture(activeTexture(), nextTexture());
                animateEasing(collect,900, easeOutQuart);
            },
            slideNextTransitionStart: function () {
                flag = false;
                sketch.loadTexture(prevTexture(), activeTexture());
                toggleImage();
            },
            slidePrevTransitionStart:function () {
                flag = false;
                sketch.loadTexture(nextTexture(), activeTexture());
                toggleImage();
            },
        }
    });


    window.addEventListener('mousewheel', (e) => {
        console.log(e.wheelDeltaY );
        if(flag){
            if(e.wheelDeltaY < 0 ){
                mainSwiper.slideNext()
            }else {
                mainSwiper.slidePrev()
            }
        }
    });
});


