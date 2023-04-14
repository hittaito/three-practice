import WebGL from './webgl/Webgl';

const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const webgl = new WebGL(canvas);

window.addEventListener('resize', () => {
    webgl.resize();
});
