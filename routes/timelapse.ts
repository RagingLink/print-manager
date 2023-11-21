import { FastifyInstance, FastifyPluginOptions } from 'fastify';
// import env from '../env/create.js';
// const TIMELAPSE_DIR = '~/hdd/timelapse';

//TODO
export default function timelapsePlugin(fastify: FastifyInstance, opts: FastifyPluginOptions, done: () => void) {
    fastify.post('/render', (_, reply) => {
        return reply.send('OK');
    });
    done();
}