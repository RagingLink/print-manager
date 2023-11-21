import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import TapoBulb from '../managers/TapoBulb.js';
import { PowerModeBody, powerModeSchema } from './Schemas.js';

export default function powerPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions, done: () => void) {
    const tapoBulb = new TapoBulb();

    fastify.get('/', () => tapoBulb.getState());
    fastify.put<{ Body: PowerModeBody }>('/', {
        schema: powerModeSchema
    }, async (request, reply) => {
        switch (request.body.mode) {
            case 'on':
            case 'off':
                return tapoBulb.changeState(request.body.mode);
            case 'toggle':
                return tapoBulb.toggleState();
            default:
                return reply.code(400).send({ error: 'Invalid power mode' });
        }
    });
    done();
}