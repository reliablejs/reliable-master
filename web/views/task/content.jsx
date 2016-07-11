'use strict';

const React = require('react');

const Charts = require('./charts');
const format = require('../logFormatter');

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formatExtraData();
  }

  formatExtraData() {
    let data = null;

    try {
      data = JSON.parse(this.props.detail.extra);
    } catch (e) {
      console.log(e);
    }

    this.extra = data ? data : {};
  }

  renderRetry() {
    if (this.props.detail.status_name === 'failed' || this.props.session.user.is_admin) {
      return (
        <a id="retry" className="btn btn-sm btn-primary" data-id={this.props.detail._id} data-method="post" href="/" rel="nofollow">Retry</a>
      );
    } else {
      return null;
    }
  }

  getStatusName() {
    const status_name = this.props.detail.status_name;
    return this.props.gettext(`page.task.status.${status_name}`);
  }

  getStatusStyleName() {
    const status_name = this.props.detail.status_name;

    if (status_name === 'waiting') {
      return 'alert-warning';
    } else if (status_name === 'running') {
      return 'alert-info'
    } else if (status_name === 'passed') {
      return 'alert-success';
    } else if (status_name === 'failed') {
      return 'alert-danger';
    }
  }

  renderExtra() {
    if (!this.extra.description) {
      return null;
    }
    return (
      <div className="build-widget">
        <h4 className="title">
          information
        </h4>
        <p>
          <span className="attr-name">Passing: </span>
          {this.extra.passing}
        </p>
        <p>
          <span className="attr-name">Failing: </span>
          {this.extra.failing}
        </p>
        <p>
          <span className="attr-name">CommitId: </span>
          {this.extra.description.commitId || ' Not Yet' }
        </p>
        <p>
          <span className="attr-name">Subject: </span>
          {this.extra.description.subject || ' Not Yet' }
        </p>
        <p>
          <span className="attr-name">Author: </span>
          {this.extra.description.author || ' Not Yet' }
        </p>
        <p>
          <span className="attr-name">Branch: </span>
          {this.extra.description.branch || ' Not Yet' }
        </p>
      </div>
    );
  }

  renderLogExport() {
    return (
      <div className="build-widget">
        <button className="btn btn-default log-export">{this.props.gettext('page.task.log_export')}</button>
      </div>
    );
  }

  renderModal() {
    return (
      <div id="image-modal" className="modal fade" tabindex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <div className="image">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  render() {
    return (
      <div className="container">
        <ol className="breadcrumb">
          <li><a href={`/history/${this.props.detail.projectId}`}>{this.props.gettext('page.common.nav.history')}</a></li>
          <li className="active">{this.props.detail.title} {this.props.gettext('page.common.nav.detail')}</li>
        </ol>
        <div className="row main">
          <div className="col-md-9 main-left">
            <div className={`alert build-head ${this.getStatusStyleName()}`}>
              <h4>
                {this.props.detail.title}
                <div className="pull-right">
                  <span>
                    <i className="icon-time"></i>
                    {this.props.detail.duration}
                  </span>
                </div>
              </h4>
              <div className="clearfix">
                {this.getStatusName()}
                <div className="pull-right">
                  {this.props.detail.start_date}
                </div>
              </div>
            </div>
            <pre className="trace content-wrapper">
              <code className="bash" dangerouslySetInnerHTML={{__html: format(this.props.detail.result_string)}}>
              </code>
            </pre>
            <div id="logs">
              <div className="bash" dangerouslySetInnerHTML={{__html: this.props.detail.result_string}}>
              </div>
            </div>
            <Charts />
          </div>
          <div id="affix-sidebar" className="col-md-3 main-right">
            <div className="build-widget">
              <h4 className="title">
                {this.props.detail.status_name}
                <div className="pull-right">
                {this.renderRetry()}
                </div>
              </h4>
              <p>
                <span className="attr-name">Duration: </span>
                {this.props.detail.duration}
              </p>

              <p>
                <span className="attr-name">Started: </span>
                {this.props.detail.start_date}
              </p>

              <p>
                <span className="attr-name">Finished: </span>
                {this.props.detail.end_date}
              </p>

              <p>
                <span className="attr-name">Runner: </span>
                {this.props.detail.slaveId}
              </p>
            </div>
            {this.renderExtra()}
            {this.renderLogExport()}
          </div>
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

module.exports = Content;
