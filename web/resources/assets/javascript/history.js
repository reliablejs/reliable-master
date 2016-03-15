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
        values: [{
          x: 0,
          y: 0
        }]
      },
      data2: {
        values: []
      },
      data3: {
        values: []
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {

    var projectId = this.props.projectId;

    let req = $.ajax({
      method: 'get',
      url: '/api/data',
      data: {
        type: 'getTaskTotalCountAndSuccessedCountByProjectId',
        id: projectId
      }
    });

    req.done(res => {
      if (res.success) {
        this.setState({
          data3: this.totalSuccessRateAdapter(res.data)
        });
      } else {}
    });

    req.fail(() => {});

    req.always(() => {});

    let req2 = $.ajax({
      method: 'get',
      url: '/api/data',
      data: {
        type: 'getTaskScheduleFromNowByProjectId',
        id: projectId,
        step: 7
      }
    });

    req2.done(res => {
      if (res.success) {

        this.setState({
          data1: this.lineChartDataAdapter(res.data.schedule),
          data2: this.successRateAdapter(res.data.schedule)
        });
      } else {}
    });

    req2.fail(() => {});

    req2.always(() => {});
  }

  totalSuccessRateAdapter(data) {
    var successedCount = data.successedCount;
    var totalCount = data.totalCount;
    var success = parseInt(successedCount / totalCount * 100, 10);

    return {
      values: [{
        x: 'success: ' + successedCount,
        y: success
      }, {
        x: 'fail: ' + (totalCount - successedCount),
        y: 100 - success
      }]
    };
  }

  lineChartDataAdapter(data) {
    var group = [];
    var successCount = 0;
    var totalCount = 0;

    try {
      group = _.groupBy(data, (d) => _.format(d.created_at, 'YYYY MM DD'));

      group = _.map(group, (d, k) => {

        successCount += _.filter(d, (_d) => _d.status === 2).length;

        totalCount += d.length;

        return {
          x: new Date(k),
          y: parseInt(successCount / totalCount * 100, 10)
        };
      });

      group = _.sortBy(group, (d) => d.x);
    } catch (e) {
      console.log(e.stack);
    }
    return {
      values: group
    };
  }

  successRateAdapter(data) {
    var successCount = 0;
    var failCount = 0;

    try {
      _.forEach(data, (data) => {
        if (data.extra) {
          var d = JSON.parse(data.extra);
          if (!isNaN(d.passing)) {
            successCount += d.passing;
          }
          if (!isNaN(d.failing)) {
            failCount += d.failing;
          }
        }
      });

    } catch (e) {
      console.log(e.stack);
    }

    var success = parseInt(successCount / (successCount + failCount) * 100, 10);

    return {
      values: [{
        x: 'success: ' + successCount,
        y: success
      }, {
        x: 'fail: ' + failCount,
        y: 100 - success
      }]
    };
  }

  getLineChartProps() {
    return {
      data: this.state.data1,
      width: 450,
      height: 180,
      margin: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
      },
      shapeColor: '#1F77B4',
      stroke: {
        strokeDasharray: '4 4 4'
      },
      xAxis: {
        tickValues: d3.time.scale().domain([this.state.data1.values[0].x, this.state.data1.values[this.state.data1.values.length - 1].x]).ticks(d3.time.day, 1),
        tickFormat: d3.time.format('%m/%d'),
        label: 'date'
      },
      yAxis: {
        tickValues: d3.scale.linear().domain([0, 100]).ticks(5),
        label: 'success rate'
      },
      tooltipHtml: (label, data) => {
        var d = new Date(data.x);
        return `date: ${d.getFullYear().toString().substr(2)}/${d.getMonth() + 1}/${d.getDate()} success rate: ${data.y}%`;
      },
      tooltipContained: true
    };
  }

  getPieChart1Props() {
    return {
      data: this.state.data2,
      width: 300,
      height: 180,
      margin: {
        top: 30,
        bottom: 30,
        left: 60,
        right: 60
      },
      sort: null,
      tooltipHtml: (label, data) => {
        return `${data}%`;
      },
      tooltipContained: true
    };
  }

  getPieChart2Props() {
    return {
      data: this.state.data3,
      width: 300,
      height: 180,
      margin: {
        top: 30,
        bottom: 30,
        left: 60,
        right: 60
      },
      sort: null,
      tooltipHtml: (label, data) => {
        return `${data}%`;
      },
      tooltipContained: true
    };
  }

  render() {
    return (
      <div className="chart fn-clear">
        <div className = "linear-chart">
          <h4>Pass rate in a week</h4>
          <LineChart {...this.getLineChartProps()} />
        </div>
        <div className="pie-chart">
          <h4>Success rate in a week</h4>
          <PieChart {...this.getPieChart1Props()}/>
        </div>
        <div className="pie-chart">
          <h4>Total success rate</h4>
          <PieChart {...this.getPieChart2Props()} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Charts projectId = {$('[data-projectid]').data('projectid') }/>, document.getElementById('charts'));

(function() {
  $('#retry').on('click', function() {
    var taskId = $(this).data('id');
    $.ajax({
      url: '/api/task/update?_csrf=' + $('#csrf_token').val(),
      async: false,
      method: 'post',
      data: {
        taskId: taskId,
        data: {
          status: 0
        }
      },
      success: function(d) {
        if (d.success) {
          location.reload();
        }
      }
    });
    return false;
  });

  $('.delete-task').on('click', function() {
    var taskId = $(this).data('id');
    $.ajax({
      url: '/api/task/delete?_csrf=' + $('#csrf_token').val(),
      async: false,
      method: 'post',
      data: {
        id: taskId
      },
      success: function(d) {
        if (d.success) {
          location.reload();
        }
      }
    });
    return false;
  });

  $('#cleanTasks').on('click', function() {
    var projectId = $(this).data('projectid');
    $.ajax({
      url: '/api/task/clean?_csrf=' + $('#csrf_token').val(),
      async: false,
      method: 'post',
      data: {
        id: projectId
      },
      success: function(d) {
        if (d.success) {
          location.reload();
        }
      }
    });
    return false;
  });
})();
