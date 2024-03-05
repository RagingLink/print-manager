import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import Commander from '../managers/Commander.js';
// import env from '../env/create.js';
// const TIMELAPSE_DIR = '~/hdd/timelapse';

//TODO
export default class TimelapseRoute {
    public constructor(public readonly commander: Commander) { }

    public registerPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions, done: () => void) {
        fastify.post('/render', (_, reply) => {
            return reply.send('OK');
        });
        fastify.post('/takeFrame', (_, reply) => {
            this.commander.timelapser.saveLayerChange('test').then(buffer => {
                if (buffer === undefined)
                    console.error('Couldn\'t take frame');
            }).catch(err => {
                console.error(err);
            });
            return reply.code(200).send('Handled');
            
        });
        done();
    }

} 