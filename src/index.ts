import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import env from './env/cleanedEnv.js';
import Commander from './managers/Commander.js';
import PowerRoute from './routes/power.js';
import TimelapseRoute from './routes/timelapse.js';

const server = Fastify().setValidatorCompiler(TypeBoxValidatorCompiler);

async function startServer() {
    const commander = new Commander();
    const powerRoute = new PowerRoute(commander);
    const timelapseRoute = new TimelapseRoute(commander);

    // Require simple AUTH_KEY to interact with the server
    server.addHook('onRequest', (request, reply, done) => {
        if (request.headers.authorization !== env.AUTH_KEY)
            return reply.code(401).send('Not OK');
        done();
    });
    await server.register((fastify, opts, done) => powerRoute.registerPlugin(fastify, opts, done), { prefix: '/power' });
    await server.register((fastify, opts, done) => timelapseRoute.registerPlugin(fastify, opts, done), { prefix: '/timelapse' });

    await server.listen({ port: env.PORT }).then(() => {
        console.log('Listening on port ' + env.PORT);
    });
}

startServer().catch(err => {
    console.error(err);
    process.exit(1);
});

