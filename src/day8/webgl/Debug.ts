import * as dat from 'lil-gui';
import stats from 'stats.js';

export default class Debug {
    ui: dat.GUI;
    stats: stats;
    constructor() {
        if (process.env.NODE_ENV !== 'production') {
            this.ui = new dat.GUI();
            this.stats = new stats();
            document.body.appendChild(this.stats.dom);
        }
    }
    begin() {
        if (this.stats) this.stats.begin();
    }
    end() {
        if (this.stats) this.stats.end();
    }
}
