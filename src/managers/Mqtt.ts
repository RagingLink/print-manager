import mqtt from 'mqtt';

import env from '../env/cleanedEnv.js';

export default class Mqtt {
    public client: mqtt.MqttClient;
    public constructor() {
        this.client = mqtt.connect(`mqtt://${env.MQTT_HOST}:${env.MQTT_PORT}`, {
            clean: true,
            connectTimeout: 4000,
            username: env.MQTT_USER,
            password: env.MQTT_PASSWORD,
            reconnectPeriod: 1000,
        });
        this.client.on('connect', () => {
            console.log('Connected to mqtt broker');
        });
    }

    public publish(topic: string, message: string) {
        this.client.publish(topic, message, { qos: 0, retain: false }, (err) => {
            if (err) {
                console.error('Publish error:', err);
            }
        });
    }
}