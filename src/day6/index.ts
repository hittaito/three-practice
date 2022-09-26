import WebGL from './webgl/Webgl';

const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const webgl = new WebGL(canvas);

window.addEventListener('resize', () => {
    console.log('resize');

    webgl.resize();
});

canvas.addEventListener('mousemove', (ev) => {
    const w = canvas.width;
    const h = canvas.height;
    if (webgl) {
        webgl.mouseMove((ev.clientX / w) * 2 - 1, (1 - ev.clientY / h) * 2 - 1);
    }
});
