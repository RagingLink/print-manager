// Manager of all devices/operations running to manage powering+timelapsing the printer
import Camera from './Camera.js';
import Mqtt from './Mqtt.js';
import TapoPlug from './TapoPlug.js';
import Timelapser from './Timelapser.js';

// Best word I could come up with 'commander'
export default class Commander {
    public readonly camera: Camera;
    public readonly tapoPlug: TapoPlug;
    public readonly timelapser: Timelapser;
    public readonly mqtt: Mqtt;
    public constructor() {
        this.mqtt = new Mqtt();
        this.camera = new Camera(this);
        this.tapoPlug = new TapoPlug(this);
        this.timelapser = new Timelapser(this);
    }
}