import * as tapo from 'tp-link-tapo-connect';

import env from '../env/create.js';

export default class TapoBulb {
    private DEVICE_KEY: tapo.TapoDeviceKey | undefined;

    constructor() {
        this.getNewDeviceKey().then(() => {
            console.log('Connected to Tapo plug');
        }).catch(err => {
            console.error(err);
        });
    }

    async changeState(state: string): Promise<string> {
        try {
            switch (state) {
                case 'off':
                    await tapo.turnOff(await this.deviceKey);
                    break;
                case 'on':
                    await tapo.turnOn(await this.deviceKey);
                    break;
            }
            return state;
        } catch (_) {
            try {
                await this.getNewDeviceKey();
                return this.changeState(state);
            } catch (err) {
                console.error(err);
                return 'off';
            }
        }
    }

    async getState(): Promise<string> {
        try {
            const state = (await tapo.getDeviceInfo(await this.deviceKey)).device_on ? 'on' : 'off';
            return state;
        } catch (_) {
            try {
                await this.getNewDeviceKey();
                return this.getState();
            } catch (err) {
                console.error(err);
                return 'off';
            }
        }
    }

    async toggleState(): Promise<string> {
        return await this.changeState((await this.getState()) === 'off' ? 'on' : 'off');
    }

    private get deviceKey(): tapo.TapoDeviceKey | Promise<tapo.TapoDeviceKey> {
        return this.DEVICE_KEY ?? this.getNewDeviceKey();
    }

    async getNewDeviceKey(): Promise<tapo.TapoDeviceKey> {
        return tapo.loginDeviceByIp(env.TAPO_EMAIL, env.TAPO_PASSWORD, env.TAPO_IP).then(tapoDeviceKey => {
            this.DEVICE_KEY = tapoDeviceKey;
            return tapoDeviceKey;
        });
    }
}