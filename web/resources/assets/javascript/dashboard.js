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

var React = require('react');
var ReactDOM = require('react-dom');
var ReactD3 = require('react-d3-components');

var _ = require('./common/helper');

var PieChart = ReactD3.PieChart;
var LineChart = ReactD3.LineChart;

class Charts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data1: {
        label: '',
        values: [{
          x: 0,
          y: 0
        }]
      },
      data2: {
        values: []
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {

    let req = $.ajax({
      method: 'get',
      url: '/api/data',
      data: {
        type: 'getTaskScheduleFromNow',
        step: 30
      }
    });

    req.done(res => {
      if (res.success) {
        this.setState({
          data1: this.data1Adapter(res.data.schedule),
          data2: this.data2Adapter(res.data.schedule)
        });
      } else {
      }
    });

    req.fail(() => {
    });

    req.always(() => {
    });
  }

  data1Adapter(data) {
    var group = [];

    try {
      group = _.groupBy(data, (d) => _.format(d.created_at, 'YYYY MM DD'));

      group = _.map(group, (d, k) => ({
        x: new Date(k),
        y: d.length
      }));

      group = _.sortBy(group, (d) => d.x);
    } catch (e) {
      console.log(e.stack);
    }
    return {
      values: group
    };
  }

  data2Adapter(data) {
    var group = [];
    var getSlaveId = function(name) {

      if (!!~name.indexOf('test1')) {
        return 'intl-slave1';
      } else if (!!~name.indexOf('test2')) {
        return 'intl-slave2';
      } else {
        return 'other';
      }
    };

    try {
      group = _.groupBy(data, (d) => d.slaveId);

      group = _.map(group, (d, k) => ({
        x: getSlaveId(k),
        y: d.length
      }));

    } catch (e) {
      console.log(e.stack);
    }

    return {
      values: group
    };
  }

  getLineChartProps() {
    return {
      data: this.state.data1,
      width: 600,
      height: 150,
      margin: {
        top: 30, bottom: 30, left: 30, right: 30
      },
      stroke: {
        strokeDasharray: '4 4 4'
      },
      xAxis: {
        tickValues: d3.time.scale().domain([this.state.data1.values[0].x, this.state.data1.values[this.state.data1.values.length - 1].x]).ticks(d3.time.day, 3),
        tickFormat: d3.time.format('%m/%d'),
        label: 'date'
      },
      yAxis: {
        tickValues: d3.scale.linear().domain([0, _.max(this.state.data1.values, (d) => d.y).y]).ticks(4),
        label: 'task number'
      },
      shapeColor: '#1F77B4',
      tooltipHtml: (label, data) => {
        var d = new Date(data.x);
        return `date: ${d.getFullYear().toString().substr(2)}/${d.getMonth() + 1}/${d.getDate()} task number: ${data.y}`;
      },
      tooltipContained: true
    };
  }

  getPieChartProps() {
    return {
      data: this.state.data2,
      width: 350,
      height: 150,
      margin: {
        top: 20, bottom: 20, left: 80, right: 80
      },
      sort: null,
      tooltipHtml: (label, data) => data,
      tooltipContained: true
    };
  }

  render() {
    return (
      <div className="chart fn-clear">
        <div className="linear-chart">
          <h4>Task number in 30 days</h4>
          <LineChart {...this.getLineChartProps()} />
        </div>
        <div className="pie-chart">
          <h4>Slave load factor</h4>
          <PieChart {...this.getPieChartProps()} />
        </div>
      </div>
    );
  }
}

var charts = document.getElementById('charts');

if (charts) {
  ReactDOM.render(<Charts />, charts);
}

(function() {
  var csrf_token = $('#csrf_token').val();
  var dialogIsEidtMode = false;
  var currentId;

  $('#project-modal').on('hidden.bs.modal', function (e) {
    $('#project-modal').find('input').each(function(e, node) {
      node.value = '';
    });
    $('#project-modal').find('textarea').each(function(e, node) {
      node.value = '';
    });
  });
  $('#project-modal').on('show.bs.modal', function(e) {
    var relatedTarget = e.relatedTarget;

    var type = $(relatedTarget).data('type');
    var id = $(relatedTarget).data('id');
    var modalLabel = $('#myModalLabel');
    var createText = modalLabel.data('createText');
    var editText = modalLabel.data('editText');

    $('#project-modal').find('select').each(function(e, node) {
      node.selectedIndex = 1;
    });

    if (type !== 'edit') {
      dialogIsEidtMode = false;
      modalLabel.text(createText);
      return;
    } else {
      modalLabel.text(editText);
    }

    currentId = id;
    dialogIsEidtMode = true;

    $.ajax({
      url: '/api/project/get?_csrf=' + csrf_token,
      data: {
        id: id
      },
      async: false,
      method: 'post',
      success: function(d) {
        if (d.success) {
          var data = d.data;
          var duration = data.duration;
          var factor = 1000 * 60 * 60;
          var hours = Math.floor(duration / factor);
          var minutes = Math.round((duration - hours * factor) / factor * 60);
          $('input[name="title"]').val(data.title);
          $('textarea[name="description"]').val(data.description);
          $('input[name="repositoryUrl"]').val(data.repositoryUrl);
          $('input[name="repositoryBranch"]').val(data.repositoryBranch);
          if (duration) {
            $('select[name="hours"]').val(hours);
            $('select[name="minutes"]').val(minutes);
          } else if (duration === 0) {
            $('select[name="hours"]').val(0);
            $('select[name="minutes"]').val(0);
          }
        } else {
        }
      }
    });
  });
  $('#submit-project').on('click', function() {
    var data = {};
    $('#project-modal').find('input').each(function(e, node) {
      data[node.name] = node.value;
    });
    $('#project-modal').find('textarea').each(function(e, node) {
      data[node.name] = node.value;
    });
    $('#project-modal').find('select').each(function(e, node) {
      data[node.name] = node.value;
    });

    if (!data['title']) {
      return $("input[name='title']").parent().addClass('alert-danger alert-dismissible');
    } else {
      $("input[name='title']").parent().removeClass('alert-danger alert-dismissible');
    }

    if (!data['repositoryUrl']) {
      return $("input[name='repositoryUrl']").parent().addClass('alert-danger alert-dismissible');
    } else {
      $("input[name='repositoryUrl']").parent().removeClass('alert-danger alert-dismissible');
    }

    if (!data['repositoryBranch']) {
      return $("input[name='repositoryBranch']").parent().addClass('alert-danger alert-dismissible');
    } else {
      $("input[name='repositoryBranch']").parent().removeClass('alert-danger alert-dismissible');
    }

    data['projectId'] = currentId;
    var hours = data['hours'];
    var minutes = data['minutes'];
    var factor = 1000 * 60 * 60;
    data['duration'] = hours * factor + minutes * factor / 60;

    $.ajax({
      url: '/api/project/' + (dialogIsEidtMode ? 'update' : 'add') + '?_csrf=' + csrf_token,
      data: data,
      async: false,
      method: 'post',
      success: function(d) {
        if (d.success) {
          $('#project-modal').modal('hide');
          location.reload();
        } else {
        }
      }
    });
  });

  $('.delete-task').on('click', function(e) {
    var currentTarget = e.currentTarget;
    var id = $(currentTarget).data('id');
    $('#submit-task-delete').data('id', id);
    $('#dialog-content').html('delete' + id);
    $('#delete-project-modal').modal('show');
  });

  $('.toggle-project').on('click', function() {
    var id = $(this).data('id');
    var status = $(this).data('status') ? 0 : 1;
    $.ajax({
      url: '/api/project/status?_csrf=' + csrf_token,
      data: {
        id: id,
        status: status
      },
      async: false,
      method: 'post',
      success: function() {
        location.reload();
      }
    });
  });

  $('#submit-task-delete').on('click', function(e) {
    var currentTarget = e.currentTarget;
    var id = $(currentTarget).data('id');
    $.ajax({
      url: '/api/project/delete?_csrf=' + csrf_token,
      data: {
        id: id
      },
      async: false,
      method: 'post',
      success: function(d) {
        location.reload();
      }
    });
  });

  $('.dropdown-menu a').on('click', function(e) {
    var target = $(e.currentTarget);
    var device = target.data('device');
    $('input[name="device"]').val(device);
    $('#device').html(device);
  });

  $('.change-level').on('click', function() {
    var id = $(this).data('id');
    var level = $(this).data('level');
    $.ajax({
      url: '/api/user/update?_csrf=' + csrf_token,
      data: {
        id: id,
        data: {
          user_level: level
        }
      },
      async: false,
      method: 'post',
      success: function() {
        location.reload();
      }
    });
  });

  $('.delete-user').on('click', function() {
    var id = $(this).data('id');
    var confirmDelete = confirm('delete ' + id + ' ?');

    if (!confirmDelete) {
      return;
    }
    $.ajax({
      url: '/api/user/delete?_csrf=' + csrf_token,
      data: {
        id: id
      },
      async: false,
      method: 'post',
      success: function() {
        location.reload();
      }
    });
  });

  $('.subscribe').on('click', function() {
    var id = $(this).data('id');
    var subscribeId = $(this).data('subscribeid');

    var _confirm = confirm(subscribeId ? 'unsubscribe email?' : 'subscribe email?');

    if (!_confirm) {
      return;
    }

    $.ajax({
      url: '/api/user/subscribe?_csrf=' + csrf_token,
      data: {
        projectId: id,
        subscribeId: subscribeId
      },
      async: false,
      method: 'post',
      success: function() {
        alert(subscribeId ? 'unsubscribe success' : 'subscribe success');
        location.reload();
      }
    });
  });

})();
