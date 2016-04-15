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

const Dialog = require('./dialog');
const _ = require('../../../../common/utils/helper');

class Content extends React.Component {

  renderSubscribe(item) {

    var subscribe = this.props.subscribe.filter(function(n) {
      return n.projectId.toString() === item._id.toString();
    });

    var has = subscribe[0];

    return <a data-id={item._id} data-subscribeid={has ? has._id : null} className="btn btn-default btn-xs subscribe">{this.props.gettext(has ? 'page.global.unsubscribe' : 'page.global.subscribe')}</a>;
  }

  renderTbody() {

    return this.props.project.list.map((item, i) => {
      let taskStatus = '';
      let statusBtn = item.status_name === 'open' ? this.props.gettext('page.global.close') : this.props.gettext('page.global.open');
      switch(item.status_name) {
        case 'open':
          taskStatus = <span className="label label-success">{item.status_name}</span>;
          break;
        default:
          taskStatus = <span className="label label-default">{item.status_name}</span>;
          break;
      }
      return (
        <tr title={item.description} key={item._id}>
          <th scope="row">
            {this.props.project.count - i - 10 * (this.props.page.pagination.current - 1)}
          </th>
          <td>
            <a href={'/history/' + item._id} target="_blank">{item.title || '-'}</a>
          </td>
          <td className="text-center">{item.last_modify_nick_name}</td>
          <td className="hidden">{item.created_date || '-'}</td>
          <td className="text-right">
            {this.renderSubscribe(item)}
            <a className="btn btn-default btn-xs edit-task" data-id={item._id} href="javascript:void(0)" data-toggle="modal" data-type="edit" data-target="#project-modal">
            {this.props.gettext('page.global.edit')}
            </a>
            <a className="btn btn-default btn-xs queue-task hidden" target="_blank" href={'/history/' + item._id}>
            {this.props.gettext('page.global.history')}
            </a>
            {this.props.session.user.is_admin ? <a className="btn btn-default btn-xs toggle-project" data-id={ item._id } data-status={ item.status } href="javascript:void(0)">
            {statusBtn}
            </a> : null}
            {this.props.session.user.is_admin ? <a className="btn btn-default btn-danger btn-xs delete-task" data-id={item._id} href="javascript:void(0)"> {this.props.gettext('page.global.delete')} </a> : null}
          </td>
          <td className="text-right">
            <a href={`/badgeboard/${item._id}?title=${item.title}&editor=true`} target="_blank">
              <img src={`/badgeboard/${item._id}`} />
            </a>
          </td>
          <td className="text-right">{taskStatus || '-'}</td>
          <td className="hidden">{item.next_time || '-'}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="panel list">
        <div className="panel-body">
          <h4 className="pull-left" dangerouslySetInnerHTML={{__html: this.props.gettext('page.task.number', this.props.project.count)}}></h4>
          <Dialog {...this.props} />
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
            <th>ID</th>
              <th>{this.props.gettext('page.global.title')}</th>
              <th className="text-center">{this.props.gettext('page.global.editor')}</th>
              <th className="hidden">{this.props.gettext('page.global.createdate')}</th>
              <th className="text-right">{this.props.gettext('page.global.operate')}</th>
              <th className="text-right">{this.props.gettext('page.global.badgeboard')}</th>
              <th className="text-right">{this.props.gettext('page.global.status')}</th>
              <th className="hidden">{this.props.gettext('page.global.nexttimer')}</th>
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
