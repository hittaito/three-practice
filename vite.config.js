import { readdirSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

let out = {};
readdirSync(`${__dirname}/src`).forEach((d) => {
    out = {
        ...out,
        [d]: resolve(__dirname, `src/${d}/index.html`),
    };
});

export default defineConfig({
    root: 'src/',
    plugins: [glsl()],
    publicDir: '../assets',
    base: '/three-practice/',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: out,
        },
    },
});
