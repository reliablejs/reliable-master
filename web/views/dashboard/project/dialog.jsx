'use strict';

const React = require('react');

class Dialog extends React.Component {

  renderHours() {
    var result = [];
    for (let i = 0; i < 24; i++) {
      result.push(<option key={i}>{i}</option>);
    }
    return result;
  }

  render() {
    return (
      <div>
        <button type="button" className="btn btn-primary pull-right" data-toggle="modal" data-target="#project-modal">{this.props.gettext('page.task.createtask')}
        </button>
        <div className="modal fade" id="project-modal" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="myModalLabel" data-create-text={this.props.gettext('page.task.createtask')}
          data-edit-text={this.props.gettext('page.task.edittask')}></h4>
              </div>
              <div className="modal-body">
                <div className="form-group alert">
                  <label htmlFor="recipient-name" className="control-label">{this.props.gettext('page.global.title')}:</label>
                  <input name="title" placeholder={this.props.gettext('page.task.inputtasktitle')} type="text" className="form-control"/>
                </div>
                <div className="form-group alert">
                  <label htmlFor="message-text" className="control-label">{this.props.gettext('page.global.description')}</label>
                  <textarea name="description" placeholder={this.props.gettext('page.task.inputtaskdescription')} className="form-control"></textarea>
                </div>
                <div className="form-group alert">
                  <label htmlFor="message-text" className="control-label">{this.props.gettext('page.global.repo')}</label>
                  <input name="repositoryUrl" placeholder={this.props.gettext('page.task.inputprojectrepositoryurl')} className="form-control" />
                </div>
                <div className="form-group alert">
                  <label htmlFor="message-text" className="control-label">{this.props.gettext('page.global.branch')}</label>
                  <input name="repositoryBranch" placeholder={this.props.gettext('page.task.inputprojectrepositorybranch')} className="form-control" value="master" />
                </div>
                <div className="form-group alert">
                  <label htmlFor="message-text" className="control-label">{this.props.gettext('page.global.environment')}</label>
                  <table id="table-environment">
                    <tr>
                      <td className="td-environment"><span className="environment-left">{this.props.gettext('page.global.envkey')}</span></td>
                      <td className="td-environment"><input type="text" className="input-env" placeholder={this.props.gettext('page.task.inputenvname')}/></td>
                      <td className="td-environment"><span className="environment-right">{this.props.gettext('page.global.envvalue')}</span></td>
                      <td className="td-environment"><input type="text" className="input-env" placeholder={this.props.gettext('page.task.inputenvvalue')}/></td>
                    </tr>
                  </table>
                  <input type="hidden" value={this.props.gettext('page.task.inputenvname')} id="inputenvname"/>
                  <input type="hidden" value={this.props.gettext('page.task.inputenvvalue')} id="inputenvvalue"/>
                  <button type="button" className="btn btn-add" id="add-environment">{this.props.gettext('page.global.add')}</button>
                  <input id="envvalue" name="environment"  type="hidden"/>
                </div>
                <div className="form-group alert">
                  <label htmlFor="message-text" className="control-label">{this.props.gettext('page.task.timer')}</label>
                  <div>
                    <div className="selectorDiv">
                      <div className="selector">
                        <select name="hours" className="form-control">
                          {this.renderHours()}
                        </select>
                      </div>
                      <span>{this.props.gettext('page.global.hour')}</span>
                    </div>
                    <div className="selectorDiv">
                      <div className="selector">
                        <select name="minutes" className="form-control">
                          <option>0</option>
                          <option>15</option>
                          <option>30</option>
                          <option>45</option>
                        </select>
                      </div>
                      <span>{this.props.gettext('page.global.minute')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">{this.props.gettext('page.global.cancel')}
                </button>
                <button type="button" className="btn btn-primary" id="submit-project">{this.props.gettext('page.global.submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="delete-project-modal" role="dialog">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title">
                  {this.props.gettext('page.global.tips')}
                </h4>
              </div>
              <div className="modal-body" id="dialog-content"></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">{this.props.gettext('page.global.cancel')}
                </button>
                <button type="button" className="btn btn-primary" id="submit-task-delete">{this.props.gettext('page.global.submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
;

module.exports = Dialog;
