//import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import Camera from './Camera.js';
import Commander from './Commander.js';
const assetsDir = path.join(fileURLToPath(new URL('.', import.meta.url)), '..', '..', 'assets');

export default class Timelapser {
    private camera: Camera;

    public constructor(public readonly commander: Commander) {
        this.camera = this.commander.camera;
    }

    public saveLayerChange(printName: string): Promise<Buffer | void> {
        return this.camera.getSnapshot().then(buffer => {
            if (buffer === undefined)
                return;
            fs.writeFile(assetsDir + '/' + printName + '.jpg', buffer, 'binary', (err) => {
                if (err !== null)
                    console.error(err);
            });
            return buffer;
        });
        
    }

    public startTimelapse(_printName: string) {

    }
}