import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import Commander from '../managers/Commander.js';
import { PowerRouteBodySchema } from './Schemas.js';

export default class PowerRoute {
    public constructor(public readonly commander: Commander) {
    }

    public registerPlugin (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: () => void) {
        const tapoPlug = this.commander.tapoPlug;
        fastify.get('/', () => tapoPlug.getState());

        fastify.withTypeProvider<TypeBoxTypeProvider>().put('/', {
            schema: {
                body: PowerRouteBodySchema
            }
        }, async (request, reply) => {
            switch (request.body.mode) {
                case 'on':
                case 'off': 
                    return tapoPlug.changeState(request.body.mode);
                case 'toggle':
                    return tapoPlug.toggleState();
                default:
                    return reply.code(400).send({ error: 'Invalid power mode' });
            }
        });
        done();
    }
}