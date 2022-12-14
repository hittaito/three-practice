import WebGL from './webgl/Webgl';

const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const webgl = new WebGL(canvas);

window.addEventListener('resize', () => {
    webgl.resize();
});
window.addEventListener('mousemove', (event: MouseEvent) => {
    if (webgl) {
        webgl.currentMouse = {
            x: event.x / window.innerWidth,
            y: 1 - event.y / window.innerHeight,
        };
    }
});
