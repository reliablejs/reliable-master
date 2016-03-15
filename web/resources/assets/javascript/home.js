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
          data1: this.data1Adapter(res.data),
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

  data1Adapter(obj) {
    var data = obj.schedule;
    var count = obj.count;

    var group = [];

    try {
      group = _.groupBy(data, (d) => _.format(d.created_at, 'YYYY MM DD'));

      group = _.map(group, (d, k) => ({
        x: new Date(k),
        y: d.length
      }));

      group = _.sortBy(group, d => d.x);

      group = _.forEach(group, (d) => {
        count += d.y;
        d.y = count;
      });
      this.setState({
        data3: count
      });
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
      height: 120,
      margin: {
        top: 30, bottom: 30, left: 50, right: 30
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
        tickValues: d3.scale.linear().domain([0, _.max(this.state.data1.values, (d) => d.y).y]).ticks(5),
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
      height: 120,
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
          <h4>Task number in 30 days, total number: {this.state.data3}</h4>
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
  $('#dialog').modal({
    show: false
  });
  $('#submit_login').on('click', function() {
    var data = {};
    $('#login_form').find('input').each(function(e, node) {
      if (node.value) {
        data[node.name] = node.value;
      } else {
        $('#dialog-content').html(node.name + ' error');
        $('#dialog').modal('show');
        return false;
      }
    });
    $.ajax({
      url: '/api/login?_csrf=' + $('#csrf_token').val(),
      data: data,
      async: false,
      method: 'post',
      success: function(d) {
        if (d.success) {
          location.href = '/dashboard';
        } else {
          $('#dialog-content').html(d.errorMsg);
          $('#dialog').modal('show');
        }
      }
    });
    return false;
  });

  $('#buc_submit_login').on('click', function() {
    location.href = '/buc/login';
  });

  $('.get-start a').on('click', function() {
    location.href = '/buc/login';
    return false;
  });

  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = $('.wrapper').width();
  canvas.height = 300;
  ctx.lineWidth = 0.3;
  ctx.strokeStyle = (new Color(150)).style;

  var mousePosition = {
    x: 30 * canvas.width / 100,
    y: 30 * canvas.height / 100
  };

  var dots = {
    nb: 250,
    distance: 100,
    d_radius: 150,
    array: []
  };

  function colorValue(min) {
    return Math.floor(Math.random() * 255 + min);
  }

  function createColorStyle(r, g, b) {
    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
  }

  function mixComponents(comp1, weight1, comp2, weight2) {
    return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
  }

  function averageColorStyles(dot1, dot2) {
    var color1 = dot1.color;
    var color2 = dot2.color;
    var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius);
    var g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius);
    var b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
    return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
  }

  function Color(min) {
    min = min || 0;
    this.r = colorValue(min);
    this.g = colorValue(min);
    this.b = colorValue(min);
    this.style = createColorStyle(this.r, this.g, this.b);
  }

  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();

    this.radius = Math.random() * 2;

    this.color = new Color();
  }

  Dot.prototype = {
    draw: function() {
      ctx.beginPath();
      ctx.fillStyle = this.color.style;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }
  };

  function createDots() {
    for (var i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
    }
  }

  function moveDots() {
    for (var i = 0; i < dots.nb; i++) {

      var dot = dots.array[i];

      if (dot.y < 0 || dot.y > canvas.height) {
        dot.vx = dot.vx;
        dot.vy = -dot.vy;
      } else if (dot.x < 0 || dot.x > canvas.width) {
        dot.vx = -dot.vx;
        dot.vy = dot.vy;
      }
      dot.x += dot.vx;
      dot.y += dot.vy;
    }
  }

  function connectDots() {
    for (var i = 0; i < dots.nb; i++) {
      for (var j = 0; j < dots.nb; j++) {
        var i_dot = dots.array[i];
        var j_dot = dots.array[j];

        if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
          if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
            ctx.beginPath();
            ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
            ctx.moveTo(i_dot.x, i_dot.y);
            ctx.lineTo(j_dot.x, j_dot.y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }
  }

  function drawDots() {
    for (var i = 0; i < dots.nb; i++) {
      var dot = dots.array[i];
      dot.draw();
    }
  }

  function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveDots();
    connectDots();
    drawDots();

    requestAnimationFrame(animateDots);
  }

  $('canvas').on('mousemove', function(e) {
    mousePosition.x = e.pageX;
    mousePosition.y = e.pageY;
  });

  $('canvas').on('mouseleave', function(e) {
    mousePosition.x = canvas.width / 2;
    mousePosition.y = canvas.height / 2;
  });

  createDots();
  requestAnimationFrame(animateDots);
})();
