import * as tapo from 'tp-link-tapo-connect';

import env from '../env/cleanedEnv.js';
import Commander from './Commander.js';

// tapo.TapoDevice isn't the return type of tapo.loginDeviceByIp(), so this is needed
interface TapoDevice {
    turnOn: () => Promise<void>;
    turnOff: () => Promise<void>;
    getDeviceInfo: () => Promise<tapo.TapoDeviceInfo>;
}

export default class TapoPlug {
    private device: TapoDevice | undefined;
    public constructor(public readonly commander: Commander) {
        this.getNewDevice().then(() => {
            console.log('Connected to Tapo plug');
        }).catch(err => {
            console.error(err);
        });
    }

    public async changeState(state: string): Promise<string> {
        try {
            const device = this.device ?? await this.getNewDevice();
            switch (state) {
                case 'off':
                    await device.turnOff();
                    break;
                case 'on':
                    await device.turnOn();
                    break;
            }
            return state;
        } catch (_) {
            try {
                await this.getNewDevice();
                return this.changeState(state);
            } catch (err) {
                console.error(err);
                return 'off';
            }
        }
    }

    public async getState(): Promise<string> {
        try {
            const device = this.device ?? await this.getNewDevice();
            const state = (await device.getDeviceInfo()).device_on ? 'on' : 'off';
            return state;
        } catch (_) {
            try {
                await this.getNewDevice();
                return this.getState();
            } catch (err) {
                console.error(err);
                return 'off';
            }
        }
    }

    public async toggleState(): Promise<string> {
        return await this.changeState((await this.getState()) === 'off' ? 'on' : 'off');
    }

    private async getNewDevice(): Promise<TapoDevice> {
        return this.device = await tapo.loginDeviceByIp(env.TAPO_EMAIL, env.TAPO_PASSWORD, env.TAPO_IP);
    }
}

export class MockTapoPlug {
    private currentState: 'on' | 'off';

    public constructor() {
        this.currentState = 'off';
    }

    public changeState(state: 'on' | 'off'): 'on' | 'off' {
        return this.currentState = state;
    }

    public toggleState(): 'on' | 'off' {
        return this.currentState = this.currentState === 'off' ? 'on' : 'off';
    }

    public getState(): 'on' | 'off' {
        return this.currentState;
    }
}