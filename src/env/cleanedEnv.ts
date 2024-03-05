import { config } from 'dotenv';
import { cleanEnv } from 'envalid';

import structure from './structure.js';
// Loads env file into process.env
config();

export default cleanEnv(process.env, structure);