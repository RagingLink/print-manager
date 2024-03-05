import { port, str} from 'envalid';

export default {
    PORT: port(),
    AUTH_KEY: str(),
    TAPO_EMAIL: str(),
    TAPO_PASSWORD: str(),
    TAPO_IP: str(),
    WEBCAM_SNAPSHOT_URL: str()
};