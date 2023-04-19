import WebGL from './webgl/Webgl';

const container = document.querySelector('.webgl') as HTMLDivElement;
const webgl = new WebGL(container);

window.addEventListener('resize', () => {
    webgl.resize();
});
