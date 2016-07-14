'use strict';

const mongoose = require('mongoose');

const _ = require('../../common/utils/helper');

const Schema = mongoose.Schema;
const P = mongoose.Promise;
const PAGE_SIZE = 10;

// project table schema
const ProjectSchema = new Schema({

  /**
   * project title
   */

  title: {
    type: String
  },

  /**
  * project description
  */

  description: {
    type: String
  },

  /**
   * project repository url
   */

  repositoryUrl: {
    type: String
  },

  /**
   * project repository branch
   */

  repositoryBranch: {
    type: String,
    default: 'master'
  },

  /**
   * environment for project
   * <key, value>
   */
  
  environment: {
    type: String
  },

  /**
   * status for project
   * 0 - > open
   * 1 - > close
   */

  status: {
    type: Number,
    default: 0
  },

  /*
   * duration time for timer
   * s
   */

  duration: {
    type: Number,
    default: 0
  },

  /**
   * next exec time
   * s
   */

  time: {
    type: Number
  },

  /**
   * create time for project
   */

  created_at: {
    type: Date,
    default: Date.now
  },

  /**
   * modify time for project
   */

  updated_at: {
    type: Date,
    default: Date.now
  },

  /**
   * create user id
   */

  create_user_id: {
    type: String
  },

  /**
   * last modify user id
   */

  last_modify_user_id: {
    type: String
  },

  /**
   * create user nick name
   */

  create_user_nick_name: {
    type: String
  },

  /**
   * last modify user nick name
   */

  last_modify_nick_name: {
    type: String
  },

  /**
   * create user email
   */

  create_user_email: {
    type: String
  },

  /**
   * last modify user email
   */

  last_modify_email: {
    type: String
  }
});

ProjectSchema.index({
  _id: 1,
  create_date: -1
});

ProjectSchema.methods.add = function() {
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

ProjectSchema.methods.removeById = function(id) {
  const promise = new P();

  Project.remove({
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

ProjectSchema.methods.updateById = function(id, data) {
  const promise = new P();

  Project.update({
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

ProjectSchema.methods.getById = function(id) {
  const promise = new P();

  Project.findOne({
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

ProjectSchema.methods.getAll = function(page) {
  const _page = parseInt(page, 10) || 1;
  const promise = new P();

  Project.find({
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

ProjectSchema.methods.getTotalCount = function() {
  const promise = new P();

  Project.count({
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

ProjectSchema.methods.getExpectedOne = function() {
  const promise = new P();

  Project.findOne({
    status: 0,
    time: {
      $lte: Date.now()
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

ProjectSchema.virtual('created_date').get(function() {
  return _.moment(this.created_at).format('YYYY-MM-DD HH:mm:ss');
});

ProjectSchema.virtual('updated_date').get(function() {
  return _.moment(this.updated_at).format('YYYY-MM-DD HH:mm:ss');
});

ProjectSchema.virtual('status_name').get(function() {
  return this.status === 0 ? 'open' : 'close';
});

ProjectSchema.virtual('next_time').get(function() {
  if (this.time === Number.MAX_SAFE_INTEGER) {
    return null;
  }
  return _.moment(this.time).format('YYYY-MM-DD HH:mm:ss');
});

mongoose.model('Project', ProjectSchema);

const Project = mongoose.model('Project');

module.exports = Project;
