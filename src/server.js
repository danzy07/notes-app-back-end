const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Mengizinkan semua origin
                headers: ['Accept', 'Content-Type'], // Header yang diizinkan
                exposedHeaders: ['X-Total-Count'], // Header yang diekspos
                additionalExposedHeaders: ['X-Request-Id'], // Header tambahan yang diekspos
                maxAge: 60, // Cache max age dalam detik
                credentials: true, // Mengizinkan pengiriman kredensial
            },
        },
    });

    // Menambahkan penangan kesalahan global
    server.ext('onPreResponse', (request, h) => {
        const response = request.response;
        if (response.isBoom) {
            console.error(response);
        }
        return h.continue;
    });

    // Mendaftarkan routes
    server.route(routes);

    // Memulai server
    await server.start();
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init(); 