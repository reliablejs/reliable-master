'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const _ = require('./utils/helper');

const mongo = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
const defaultCfg = {
  server: {
    worker: os.cpus().length,
    port: 8080,
    protocol: 'http'
  },
  database: `mongodb://${mongo}/reliable`,
  site: {
    title: 'Reliable',
    baseurl: 'http://reliable-test.com',
    locale: 'en-US',
    docurl: 'https://macacajs.github.io/macaca',
    issueurl: 'https://github.com/reliablejs/reliable-master',
    login: true
  },
  auth: {
    github: {
      client_id: '8bb3d4f7fa7d3d346a58',
      client_secret: '416bdc362cefb378587aa75c1db9bdd4c84a3461'
    },
    gitlab: {
      protocol: 'http',
      server_url: '127.0.0.1:3000',
      client_id: '8bb3d4f7fa7d3d346a58',
      client_secret: '416bdc362cefb378587aa75c1db9bdd4c84a3461'
    }
  },
  mail: {
    name: 'reliable test',
    port: 465,
    host: 'smtp.reliable-test.com',
    secure: true,
    ignoreTLS: true,
    auth: {
      user: 'test@reliable-test.com',
      pass: 'reliable'
    },
    sloganImage: 'https://avatars0.githubusercontent.com/u/9263042?v=3&s=200'
  },
  plugins: []
};

var config = null;

exports.get = function() {
  if (config) {
    return config;
  }

  var rootPath = path.join(__dirname, '..');
  var list = fs.readdirSync(rootPath);

  list.forEach(item => {
    if (path.extname(item) === '.js' && !!~item.indexOf('.reliable.config.js')) {
      var mod = path.join(rootPath, item);
      config = _.merge({}, defaultCfg, require(mod));
    }
  });

  return config || defaultCfg;
};
