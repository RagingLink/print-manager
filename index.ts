import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import env from './env/create.js';
import powerRoute from './routes/power.js';
import timelapseRoute from './routes/timelapse.js';

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>();
async function startServer() {
    // Require simple AUTH_KEY to interact with the server
    server.addHook('onRequest', (request, reply, done) => {
        if (request.headers.authorization !== env.AUTH_KEY)
            return reply.code(401).send('Not OK');
        done();
    });
    await server.register(powerRoute, { prefix: '/power' });
    await server.register(timelapseRoute, { prefix: '/timelapse' });

    await server.listen({ port: env.PORT }).then(() => {
        console.log('Listening on port ' + env.PORT);
    });
}

startServer().catch(err => {
    console.error(err);
    process.exit(1);
});

