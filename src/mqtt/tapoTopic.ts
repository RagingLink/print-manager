import Mqtt from '../managers/Mqtt.js';
import TapoPlug from '../managers/TapoPlug.js';

export default function tapoTopic(mqtt: Mqtt, tapoPlug: TapoPlug) {

    mqtt.client.subscribe('state/plug/power', () => {
        tapoPlug.getState().then(state => {
            mqtt.publish('state/plug/power', state);
        }).catch(() => { });
    });
    mqtt.client.subscribe('command/plug/power', (err) => {
        if (err !== null)
            console.error(err);
    });

    mqtt.client.on('message', (topic, message) => {
        const msg = message.toString();
        switch (topic) {
            case 'command/plug/power': {
                if (msg === 'on' || msg === 'off') {
                    tapoPlug.changeState(msg).then(state => {
                        mqtt.publish('state/plug/power', state);
                    }).catch(() => { });
                } else if (msg === 'toggle') {
                    tapoPlug.toggleState().then(state => {
                        mqtt.publish('state/plug/power', state);
                    }).catch(() => { });
                } else {
                    tapoPlug.getState().then(state => {
                        mqtt.publish('state/plug/power', state);
                    }).catch(() => { });
                }
                break;
            }
        }
    });
}