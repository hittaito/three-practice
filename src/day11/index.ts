import WebGL from './webgl/Webgl';

const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const webgl = new WebGL(canvas);

window.addEventListener('resize', () => {
    webgl.resize();
});
canvas.addEventListener('mousemove', (event: MouseEvent) => {
    const w = canvas.width;
    const h = canvas.height;
    if (webgl) {
        webgl.onMouse(
            (event.clientX / w) * 2 - 1,
            (1 - event.clientY / h) * 2 - 1
        );
    }
});
