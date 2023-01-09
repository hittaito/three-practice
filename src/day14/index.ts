import WebGL from './webgl/Webgl';

const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const webgl = new WebGL(canvas);

window.addEventListener('resize', () => {
    webgl.resize();
});
window.addEventListener('click', (event) => {
    webgl.onClick(
        (event.x / window.innerWidth) * 2 - 1,
        (1 - event.y / window.innerHeight) * 2 - 1
    );
});
