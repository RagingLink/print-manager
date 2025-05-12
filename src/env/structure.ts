import { port, str} from 'envalid';

export default {
    PORT: port(),
    HOST: str(),
    MQTT_HOST: str(),
    MQTT_PORT: port(),
    MQTT_USER: str(),
    MQTT_PASSWORD: str(),
    AUTH_KEY: str(),
    TAPO_EMAIL: str(),
    TAPO_PASSWORD: str(),
    TAPO_IP: str(),
    WEBCAM_SNAPSHOT_URL: str()
};