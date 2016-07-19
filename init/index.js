'use strict';

const path = require('path');
const EOL = require('os').EOL;
const cluster = require('cluster');
const program = require('commander');

const Task = require('../core').Task;
const Slave = require('../core').Slave;
const _ = require('../common/utils/helper');
const logger = require('../common/utils/logger');
const defaultOpts = require('../common/config').get();

program
  .option('-p, --port <d>',   'set port for server (default: 8080)')
  .option('-w, --worker <d>', 'server worker number')
  .option('-d, --debug',      'start server with debug mode')
  .option('--verbose',        'show more debugging information')
  .parse(process.argv);

let options = _.clone(defaultOpts);
_.merge(options.server, _.getConfig(program));
options.pkg = require('../package');

function startTaskServer(options) {
  Task.run(options, () => {
    Slave.init();
  });
}

exports.initWithBin = function() {
  const worker = path.join(__dirname, 'worker.js');
  let onlineNumber = 0;

  cluster.setupMaster({
    exec: worker,
    args: process.argv,
    silent: false
  });

  cluster
    .on('fork', () => {
      logger.debug('worker fork success');
    })
    .on('online', () => {
      logger.debug('worker online');
    })
    .on('listening', (worker, address) => {
      onlineNumber++;

      logger.debug(`listening worker id: ${worker.id}, pid: ${worker.process.pid}, address: ${_.ipv4}:${address.port}`);

      if (onlineNumber === parseInt(options.server.worker, 10)) {
        logger.info(`Server start at ${_.moment().format('YYYY-MM-DD HH:mm:ss')} | ${options.server.protocol}://${_.ipv4}:${address.port}`);
        startTaskServer(options);
      }
    })
    .on('disconnect', () => {
      logger.debug('worker disconnect');
    })
    .on('exit', (worker, code, signal) => {
      logger.debug(`worker exit code: ${code} signal: ${signal || 'null'}`);
    })
    .on('error', err => {
      logger.debug(`worker error happened: ${err}`);
    });

  process.on('uncaughtException', function(err) {
    logger.debug(`Caught exception: ${err.stack}`);
  });

  for (let i = 0; i < options.server.worker; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(id => {
    cluster.workers[id].on('message', e => {
      switch (e.message) {
        case 'killMaster':
          process.exit(-1);
          break;
      }
    });
    cluster.workers[id].send({
      message: 'startServer',
      data: options
    });
  });
};

process.on('uncaughtException', function(err) {
  console.error('Error caught in uncaughtException event:', err);
});
