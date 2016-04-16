/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const React = require('react');

class Content extends React.Component {

  formatExtraData(item) {
    let data = null;
    try {
      data = JSON.parse(item.extra);
    } catch (e) {
      console.log(e);
    }

    return data ? data : {};
  }

  renderTbody() {
    return this.props.history.list.map((item, i) => {
      let taskStatus = '';
      const extra = this.formatExtraData(item);
      const extraInfo = extra.description ? `${extra.description.commitId} / ${extra.description.subject}` : null;
      switch (item.status_name) {
        case 'waiting':
          taskStatus = <span className="label label-warning">{this.props.gettext('page.task.status.waiting')}</span>;
          break;
        case 'running':
          taskStatus = <span className="label label-info">{this.props.gettext('page.task.status.running')}</span>;
          break;
        case 'passed':
          taskStatus = <span className="label label-success">{this.props.gettext('page.task.status.passed')}</span>;
          break;
        case 'failed':
          taskStatus = <span className="label label-danger">{this.props.gettext('page.task.status.failed')}</span>;
          break;
        default:
          break;
      }
      return (
        <tr title={item.description} key={item._id}>
          <th scope="row">{this.props.history.count - i - 10 * (this.props.page.pagination.current - 1) }</th>
          <td>{taskStatus}</td>
          <td><a href={ '/task/' + item._id }>{extraInfo || '-'}</a></td>
          <td>{item.duration || '-'}</td>
          <td>{item.end_date || '-'}</td>
          <td className="text-center">
            <a className="btn btn-default btn-xs queue-task" target="_blank" href={ '/task/' + item._id }>{this.props.gettext('page.global.detail')}</a>
            {this.props.session.user.is_admin ?
              <a className="btn btn-default btn-danger btn-xs delete-task" data-id={item._id}
                 href="javascript:void(0)">{this.props.gettext('page.global.delete')}</a> : null}
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="panel list" data-projectid={this.props.history.project.id}>
        <div className="panel-body">
          <h4 className="pull-left" dangerouslySetInnerHTML={{__html: this.props.gettext('page.task.record', this.props.history.count)}}></h4>
          {this.props.session.user.is_admin ? <button type="button" id="cleanTasks" className="btn btn-warning pull-right" data-projectid={this.props.history.project.id}>{this.props.gettext('page.global.clean')}</button> : null}
        </div>
        <table className="table table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>{this.props.gettext('page.global.status')}</th>
            <th>{this.props.gettext('page.global.description')}</th>
            <th>{this.props.gettext('page.global.duration')}</th>
            <th>{this.props.gettext('page.global.enddate')}</th>
            <th className="text-center">{this.props.gettext('page.global.operate')}</th>
          </tr>
          </thead>
          <tbody>
          {this.renderTbody()}
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = Content;
