'use strict';

const models = require('../../../common/models');
const _ = require('../../../common/utils/helper');
const logger = require('../../../common/utils/logger');
const pagination = require('../../../common/utils/pagination');

const Project = models.Project;
const Task = models.Task;

function *getAllProjects(page) {
  const project = new Project();

  return {
    list: yield project.getAll(page),
    count: yield project.getTotalCount()
  };
}

function *addProject() {
  const post = yield _.parse(this);
  const project = new Project();
  _.merge(project, post);

  project.repositoryUrl = _.trim(project.repositoryUrl);
  project.repositoryBranch = _.trim(project.repositoryBranch);
  project.create_user_nick_name = this.session.user.name;
  project.last_modify_nick_name = this.session.user.name;
  project.create_user_id = this.session.user.userid;
  project.last_modify_user_id = this.session.user.userid;
  project.create_user_email = this.session.user.email;
  project.last_modify_email = this.session.user.email;
  project.time = _.moment().format('x');

  if (yield project.add()) {
    this.body = {
      success: true,
      errorMsg: null,
      data: null
    };
  } else {
    this.body = {
      success: false,
      errorMsg: this.gettext('page.global.system_error'),
      data: null
    };
  }
}

function *updateProject() {
  const post = yield _.parse(this);
  const projectId = post.projectId;
  const project = new Project();
  _.merge(post, {
    last_modify_user_id: this.session.user.userid,
    last_modify_nick_name: this.session.user.name,
    last_modify_email: this.session.user.email,
    updated_at: Date.now()
  });

  if (yield project.updateById(projectId, post)) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *closeProject() {
}

function *getProject() {
  const post = yield _.parse(this);
  const id = post.id;
  const project = new Project();
  const data = yield project.getById(id);

  this.body = {
    success: true,
    data: data
  };
}

function *deleteProject() {
  const post = yield _.parse(this);
  const id = post.id;
  const project = new Project();
  const task = new Task();

  try {
    yield [project.removeById(id), task.removeByProjectId(id)];
    this.body = {
      success: true
    };
  } catch (e) {
    logger.debug(`Failed to delete project ${id}, error: ${e}`);
    this.body = {
      success: false
    };
  }
}

function *changeProjectStatus() {
  const post = yield _.parse(this);
  const id = post.id;
  const project = new Project();
  const data = yield project.getById(id);
  data.status = post.status;
  data.updated_at = Date.now();

  try {
    yield project.updateById(id, data);
    this.body = {
      success: true
    };
  } catch (e) {
    logger.debug(`Failed to update project ${id}, error: ${e}`);
    this.body = {
      success: false
    };
  }
}

function *dispatch() {
  switch (this.params.method) {
    case 'add':
      yield addProject.call(this);
      break;
    case 'close':
      yield closeProject.call(this);
      break;
    case 'delete':
      yield deleteProject.call(this);
      break;
    case 'update':
      yield updateProject.call(this);
      break;
    case 'get':
      yield getProject.call(this);
      break;
    case 'status':
      yield changeProjectStatus.call(this);
      break;
  }
}

module.exports = dispatch;
