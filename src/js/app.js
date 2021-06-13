import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import gsap from 'gsap';

export default class Sketch {
    constructor() {

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild( this.renderer.domElement );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
        // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.point = new THREE.Vector2();

        this.textures = [
            new THREE.TextureLoader().load('./img/t1.png'),
            new THREE.TextureLoader().load('./img/t2.png'),
        ]
        this.mask = new THREE.TextureLoader().load('./img/particle_mask.jpg');

        this.time = 0;
        this.move = 0;

        this.creatingVar();
        this.addMesh();
        this.mouseEffects();
        this.addRender();
    }

    mouseEffects() {
        this.test = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000, 2000),
            new THREE.MeshBasicMaterial(),
        );

        window.addEventListener('mousewheel', (e) => {
            this.move += e.wheelDeltaY / 20;
            // console.log(this.move, this.camera.position.z, this.time);
        });

        window.addEventListener('mousedown', (e) => {
            gsap.to(this.material.uniforms.mousePressed, {
                duration:1,
                value: 1,
                ease: "elastic.out(1, 0.3)"
            })
        });

        window.addEventListener('mouseup', (e) => {
            gsap.to(this.material.uniforms.mousePressed, {
                duration:1,
                value: 0,
                ease: "elastic.out(1, 0.3)"
            })
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects([this.test])
            console.log(intersects);
            this.point.x = intersects[0].point.x;
            this.point.y = intersects[0].point.y;

        }, false);
    }

    addMesh () {
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms:{
                progress: {type: 'f', value: 0},
                t1: { type: 't', value: this.textures[0] },
                t2: { type: 't', value: this.textures[1] },
                mask:{ type: 't', value: this.mask },
                mouse:{ type: 'v2', value: null },
                mousePressed:{ type: 'f', value: 0 },
                move:{ type: 'f', value: 0},
                time:{ type: 'f', value: 0}
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });

        let number = 512*512;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute( new Float32Array(number*3), 3);
        this.coordinates = new THREE.BufferAttribute( new Float32Array(number*3), 3);
        this.speeds = new THREE.BufferAttribute( new Float32Array(number), 1);
        this.offset = new THREE.BufferAttribute( new Float32Array(number), 1);
        this.direction = new THREE.BufferAttribute( new Float32Array(number), 1);
        this.press = new THREE.BufferAttribute( new Float32Array(number), 1);

        function rand(a,b) {
            return a + (b-a)*Math.random();
        }

        let index = 0;
        for(let i = 0; i < 512; i++) {
            let posX = i - 256;
            for(let j = 0; j < 512; j++){
                this.positions.setXYZ(index, posX*2,(j-256)*2,0);
                this.coordinates.setXYZ(index, i, j, 0);
                this.offset.setX(index, rand(-1000, 1000));
                this.speeds.setX(index, rand(0.4, 1));
                this.direction.setX(index, Math.random()>0.5?1:-1);
                this.press.setX(index, rand(0.4, 1));
                index++;
            }
        }

        this.geometry.setAttribute('position', this.positions);
        this.geometry.setAttribute('aCoordinates', this.coordinates);
        this.geometry.setAttribute('aOffset', this.offset);
        this.geometry.setAttribute('aSpeed', this.speeds);
        this.geometry.setAttribute('aDirection', this.direction);
        this.geometry.setAttribute('aPress', this.press);
        this.mesh = new THREE.Points( this.geometry, this.material );

        this.scene.add( this.mesh );
    }

    creatingVar () {
        this.fpsInterval = 1000 / 60;
        this.now = 0;
        this.then = Date.now();
        this.elapsed = 0;
        this.requestAnimation = 0;
    }

    down(){
        console.log( this.material.uniforms.move.value );
        this.time++;
        this.material.uniforms.move.value = this.move;
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.mouse.value = this.point;
        this.renderer.render( this.scene, this.camera );
    }

    addRender(){

        this.requestAnimation = requestAnimationFrame(this.addRender.bind(this));
        this.down();
        // Проверяем сколько времени просшло с предыдущего запуска
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        //Проверяем прошло ли достаточно времени от прошлой отрисовки кадра
        if(this.elapsed > this.fpsInterval) {
            //сохранение времени текущей отрисовки кадр
            this.then = this.now - (this.elapsed % this.fpsInterval);

        }
    }
}

new Sketch();
