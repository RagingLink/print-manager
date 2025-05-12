// ! All this code is honestly a bit messy...
import * as tapo from 'tp-link-tapo-connect';

import env from '../env/cleanedEnv.js';
import Commander from './Commander.js';

interface EnergyUsage {
    today_runtime: number; // in minutes
    month_runtime: number;  // in minutes
    today_energy: number; // in Wh
    month_energy: number; // in Wh
    local_time: string; // YYYY-MM-DD HH:MM:SS
    electricity_charge: [number, number, number]; //[idk, idk, total cost month in milli units (e.g. 1000 = 1.0 euro)]
    current_power: number; // in mW
    watt_hours_since_start: number; // in Wh
}

// tapo.TapoDevice isn't the return type of tapo.loginDeviceByIp(), so this is needed
interface TapoDevice {
    turnOn: () => Promise<void>;
    turnOff: () => Promise<void>;
    getDeviceInfo: () => Promise<tapo.TapoDeviceInfo>;
    getEnergyUsage: () => Promise<tapo.TapoDeviceInfo>; // incorrectly typed
}

export default class TapoPlug {
    #interval?: NodeJS.Timeout;
    private cachedUsage: EnergyUsage | undefined;
    private wattHourSinceStart = 0;
    private device: TapoDevice | undefined;

    public constructor(public readonly commander: Commander) {
        this.getNewDevice().then(() => {
            console.log('Setup new tapo device');
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
        const device = (await tapo.loginDeviceByIp(env.TAPO_EMAIL, env.TAPO_PASSWORD, env.TAPO_IP));
        if (this.#interval !== undefined) clearInterval(this.#interval);
        this.#interval = setInterval(() => {
            this._getEnergyUsage().then((usage) => {
                this.wattHourSinceStart += usage.current_power / 1000 * (1 / 3600);
                this.commander.mqtt.publish('state/plug/usage', JSON.stringify(usage));
            }).catch(err => {
                console.error(err);
            });
        }, 1000);
        return device;
    }

    public async getEnergyUsage(): Promise<EnergyUsage> {
        if (this.cachedUsage !== undefined) return this.cachedUsage;
        return await this._getEnergyUsage();
    }

    private async _getEnergyUsage(): Promise<EnergyUsage> {
        try {
            const device = this.device ?? await this.getNewDevice();
            return this.cachedUsage = Object.assign({ watt_hours_since_start: this.wattHourSinceStart }, (await device.getEnergyUsage())) as unknown as EnergyUsage;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

// export class MockTapoPlug {
//     private currentState: 'on' | 'off';

//     public constructor() {
//         this.currentState = 'off';
//     }

//     public changeState(state: 'on' | 'off'): 'on' | 'off' {
//         return this.currentState = state;
//     }

//     public toggleState(): 'on' | 'off' {
//         return this.currentState = this.currentState === 'off' ? 'on' : 'off';
//     }

//     public getState(): 'on' | 'off' {
//         return this.currentState;
//     }
// }