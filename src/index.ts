import Server from './server/server';
import router from './router/router';

const bodyParser = require('body-parser');

const port = Number(process.env.PORT) || 3000;
const server = Server.init(port);

// parse application/x-www-form-urlencoded
server.app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
server.app.use(bodyParser.json())

server.app.use(router);

server.start(() => console.log('Iniciando servidor en el puerto', port))