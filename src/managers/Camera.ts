import axios from 'axios';

import env from '../env/cleanedEnv.js';
import Commander from './Commander.js';

export default class Camera {
    public constructor(public readonly commander: Commander) { }

    public async getSnapshot(): Promise<Buffer | void> {
        try {
            return await axios.get<Buffer>(env.WEBCAM_SNAPSHOT_URL,
                { responseType: 'arraybuffer' }
            ).then(response => {
                return response.data;
            });
        } catch (err) {
            console.error(err);
            return;
        }
    }
}