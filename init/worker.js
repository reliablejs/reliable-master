'use strict';

const cluster = require('cluster');

const Web = require('../web');
const Task = require('../core').Task;

if (cluster.isWorker) {
  cluster.worker.on('message', (e) => {
    switch (e.message) {
      case 'startServer':
        Web.init(e.data, () => {
          Task.bind();
        });
        break;
    }
  });
}

process.on('uncaughtException', function(err) {
  console.error('Worker Error caught in uncaughtException event:', err);
});


