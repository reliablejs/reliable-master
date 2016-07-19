'use strict';

const EOL = require('os').EOL;
const mongoose = require('mongoose');

const _ = require('../../common/utils/helper');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const P = mongoose.Promise;
const PAGE_SIZE = 10;

/**
 * 0 -> waiting
 * 1 -> running
 * 2 -> passed
 * 3 -> failed
*/

const STATUS = ['waiting', 'running', 'passed', 'failed'];

// Task table schema
const TaskSchema = new Schema({

  // project id

  projectId: {
    type: ObjectId
  },

  // slave id

  slaveId: {
    type: String
  },

  //task description

  extra: {
    type: String
  },

  // task status

  status: {
    type: Number,
    default: 0
  },

  // task result

  result: {
    type: Array,
    default: []
  },

  // task create time

  created_at: {
    type: Date,
    default: Date.now
  },

  // task start time

  start_at: {
    type: Date
  },

  // task end time

  end_at: {
    type: Date
  }
});

TaskSchema.index({
  _id: 1,
  created_at: -1
});

TaskSchema.methods.add = function() {
  const promise = new P();

  this.save((error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getByProjectId = function(projectId, page) {
  const _page = parseInt(page, 10) || 1;
  const promise = new P();

  Task.find({
    projectId: projectId
  }, null, {
    skip: PAGE_SIZE * (_page - 1),
    sort: {
      _id: -1
    },
    limit: PAGE_SIZE || Infinity
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getLastOneByProjectId = function(projectId) {
  const promise = new P();

  Task.findOne({
    projectId: projectId
  }, null, {
    sort: {
      _id: -1
    }
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.updateById = function(id, data) {
  const promise = new P();

  Task.update({
    _id: id
  }, data, {
    upsert: true
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.removeById = function(id) {
  const promise = new P();

  Task.findOneAndRemove({
    _id: id
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.removeByProjectId = function(projectId) {
  const promise = new P();

  Task.remove({
    projectId: projectId
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.cleanTasksByProjectId = function(projectId) {
  const promise = new P();

  Task.remove({
    projectId: projectId,
    status: 0
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.findByIdAndPushResult = function(id, data) {
  const result = data.body;
  const promise = new P();

  Task.findByIdAndUpdate(id, {
    $push: {
      result: result
    }
  }, {
    upsert: true
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.findByIdAndUpdate = function(id, data) {
  const promise = new P();

  Task.findByIdAndUpdate(id, {
    $set: {
      status: data.bodyStatus,
      extra: JSON.stringify(data.extra),
      end_at: Date.now()
    }
  }, {
    upsert: true
  }, (error, data) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getAll = function(page) {
  const _page = parseInt(page, 10) || 1;
  const promise = new P();

  Task.find({
  }, null, {
    skip: PAGE_SIZE * (_page - 1),
    sort: {
      _id: -1
    },
    limit: PAGE_SIZE || Infinity
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getTotalCount = function() {
  const promise = new P();

  Task.count({
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getTaskTotalCountFromStep = function(step) {
  const promise = new P();

  Task.count({
    created_at: {
      $lt: _.moment().subtract(step, 'days').format('YYYY MM DD')
    }
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getTotalCountByProjectId = function(projectId) {
  const promise = new P();

  Task.count({
    projectId: projectId
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getSuccessedCountByProjectId = function(projectId) {
  const promise = new P();

  Task.count({
    projectId: projectId,
    status: 2
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getScheduleFromNowByProjectId = function(projectId, step) {
  const promise = new P();

  Task.find({
    projectId: projectId,
    created_at: {
      $gt: _.moment().subtract(step, 'days').format('YYYY MM DD')
    }
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      var need = ['created_at', 'status', 'extra'];
      promise.resolve(null, data.map((v) => _.pick(v, need)));
    }
  });
  return promise;
};

TaskSchema.methods.getScheduleFromNow = function(step) {
  const promise = new P();

  Task.find({
    created_at: {
      $gt: _.moment().subtract(step, 'days').format('YYYY MM DD')
    }
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      var need = ['created_at', 'slaveId'];
      promise.resolve(null, data.map((v) => _.pick(v, need)));
    }
  });
  return promise;
};

TaskSchema.methods.getQueueCount = function() {
  const promise = new P();

  Task.count({
    status: 0
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getTaskCountByProjectId = function(projectId) {
  const promise = new P();

  Task.count({
    projectId: projectId
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getById = function(id) {
  const promise = new P();

  Task.findOne({
    _id: id
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getExpectedOne = function() {
  const promise = new P();

  Task.findOne({
    status: 0
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.methods.getOutdatedTasks = function(minutes) {
  const promise = new P();

  Task.find({
    status: 1,
    start_at: {
      $lt: _.moment().subtract(minutes, 'minutes').toDate()
    }
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

TaskSchema.virtual('start_date').get(function() {
  if (!this.start_at) {
    return null;
  }
  return _.moment(this.start_at).format('YYYY-MM-DD HH:mm:ss');
});

TaskSchema.virtual('end_date').get(function() {
  if (!this.end_at) {
    return null;
  }
  return _.moment(this.end_at).format('YYYY-MM-DD HH:mm:ss');
});

TaskSchema.virtual('duration').get(function() {
  if (!(this.start_at && this.end_at)) {
    return null;
  }
  const start_date = _.moment(this.start_at);
  const end_date = _.moment(this.end_at);
  const duration = end_date.diff(start_date, 'seconds');
  const time = _.secondsToTime(duration);
  return `${time.h}h ${time.m}m ${time.s}s`;
});

TaskSchema.virtual('status_name').get(function() {
  return STATUS[this.status];
});

TaskSchema.virtual('result_string').get(function() {
  return this.result.join(EOL);
});

mongoose.model('Task', TaskSchema);

const Task = mongoose.model('Task');

module.exports = Task;
module.exports.STATUS = STATUS;
