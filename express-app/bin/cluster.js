const cluster = require('cluster');
const http = require('http');
const app = require('../app.js');
const numCPUs = require('os').cpus().length;
const workers = {};
var debug = require('debug')('ex:server');

if(cluster.isMaster){
  console.log('Fork %s workers from master', numCPUs);
  for (let index = 0; index < numCPUs; index++) {
    let worker = cluster.fork();
    workers[worker.process.pid] = worker;
  };

  cluster.on('online',function(worker){
    console.log(`worker is running on ${worker.id} pid`);
  });

  // 进程退出
  cluster.on('exit',function(worker,code,signal){
    delete workers[worker.process.pid];
    const newWorker = cluster.fork();
    workers[newWorker.process.pid] = newWorker;
    console.log('worker with %s is closed', worker.process.pid);
  });
} else {
  // run app here
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
  server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', ()=>{onListening(server)});
  console.log('worker (%s) is now listening to http://localhost:3000', cluster.worker.process.pid);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(server) {
  console.log('server start on port 3000');
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

