
import Commander from './managers/Commander.js';
import tapoTopic from './mqtt/tapoTopic.js';

const commander = new Commander();
tapoTopic(commander.mqtt, commander.tapoPlug);

    // Just commented out for now I guess, idk if mqtt is going to be great, but it's needed for the sensor
    // const powerRoute = new PowerRoute(commander); 
    // const timelapseRoute = new TimelapseRoute(commander);
    // // Require simple AUTH_KEY to interact with the server
    // server.addHook('onRequest', (request, reply, done) => {
    //     console.log(request.url + request.method);
    //     if (request.headers.authorization !== env.AUTH_KEY)
    //         return reply.code(401).send('Not OK');
    //     done();
    // });
    // await server.register((fastify, opts, done) => powerRoute.registerPlugin(fastify, opts, done), { prefix: '/power' });
    // await server.register((fastify, opts, done) => timelapseRoute.registerPlugin(fastify, opts, done), { prefix: '/timelapse' });

    // await server.listen({ port: env.PORT, host: env.HOST }).then(() => {
    //     console.log('Listening on port ' + env.PORT);
    // });

