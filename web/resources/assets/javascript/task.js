'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactD3 = require('react-d3-components');

var logs;
var result;
var timer;
var LineChart = ReactD3.LineChart;

class Charts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
      Meminfo: {
        values: [{
          x: 0,
          y: 0
        }]
      },
      ThreadCount: {
        values: [{
          x: 0,
          y: 0
        }]
      },
      cpu: {
        values: [{
          x: 0,
          y: 0
        }]
      },
      wifiData: {
        values: [{
          x: 0,
          y: 0
        }]
      },
      mobileData: {
        values: [{
          x: 0,
          y: 0
        }]
      }
    };
  }

  componentDidMount() {
    this.getData();
    if (this.state.isShown) {
      this.setDataState();
    }
  }

  extract(logs) {
    var map = {};
    var pattern = /\<\#\s*chart\s*\|([\s\S]+?)\#\>/g;
    var arr;
    while ((arr = pattern.exec(logs)) !== null) {
      var log = arr[1];
      var result = JSON.parse(log);
      result.forEach(obj => {
        var item = obj.item;
        if (!(item in map)) {
          map[item] = [];
        }
        map[item].push(obj.data);
      });
    }
    return map;
  }

  extractTimer(logs) {
    var timer;
    var pattern = /\<\#\s*timer\s*\|([\s\S]+?)\#\>/g;
    var arr = pattern.exec(logs);
    if (arr) {
      var log = arr[1].trim();
      timer = log.split(' ')[0];
    } else {
      timer = 5;
    }
    return +timer;
  }

  getData() {
    logs = document.querySelector('#logs').textContent;
    result = this.extract(logs);
    if (Object.keys(result).length) {
      this.state.isShown = true;
    }
    timer = this.extractTimer(logs);
  }

  getMemData() {
    var valuesTemp = [];
    var meminfo = result['Meminfo'];
    for (var i = 0, j = meminfo.length; i < j; i++) {
      valuesTemp.push({
        x: i * timer,
        y: +meminfo[i]
      });
    }
    return {
      label: 'Meminfo',
      values: valuesTemp
    };
  }

  getThreadData() {
    var valuesTemp = [];
    var threadCount = result['ThreadCount'];
    for (var i = 0, j = threadCount.length; i < j; i++) {
      valuesTemp.push({
        x: i * timer,
        y: +threadCount[i]
      });
    };
  }

  getCpuData() {
    var valuesTemp = [];
    var cpu = result['cpu'];
    for (var i = 0, j = cpu.length; i < j; i++) {
      valuesTemp.push({
        x: i * timer,
        y: +cpu[i]
      });
    };
  }

  getTrafficWifiData() {
    var valuesTempRcv = [];
    var valuesTempSnd = [];
    var traffic = result['Traffic'];
    for (var i = 0, j = traffic.length; i < j; i++) {
      valuesTempRcv.push({
        x: i * timer,
        y: (traffic[i].wifi.rcv - traffic[0].wifi.rcv) / 1024
      });
      valuesTempSnd.push({
        x: i * timer,
        y: (traffic[i].wifi.snd - traffic[0].wifi.snd) / 1024
      });
    }
    return [
      {
        label: 'TrafficWifiRcv(KB)',
        values: valuesTempRcv
      },
      {
        label: 'TrafficWifiSnd(KB)',
        values: valuesTempSnd
      }
    ];
  }

  getTrafficMobileData() {
    var valuesTempRcv = [];
    var valuesTempSnd = [];
    var traffic = result['Traffic'];
    for (var i = 0, j = traffic.length; i < j; i++) {
      valuesTempRcv.push({
        x: i * timer,
        y: (traffic[i].mobile.rcv - traffic[0].mobile.rcv) / 1024
      });
      valuesTempSnd.push({
        x: i * timer,
        y: (traffic[i].mobile.snd - traffic[0].mobile.snd) / 1024
      });
    }
    return [
      {
        label: 'TrafficMobileRcv',
        values: valuesTempRcv
      },
      {
        label: 'TrafficMobileSnd',
        values: valuesTempSnd
      }
    ];
  }

  setDataState() {
    var Meminfo = this.getMemData();
    var ThreadCount = this.getThreadData();
    var cpu = this.getCpuData();
    var wifiData = this.getTrafficWifiData();
    var mobileData = this.getTrafficMobileData();

    this.setState({
      Meminfo: Meminfo,
      ThreadCount: ThreadCount,
      cpu: cpu,
      wifiData: wifiData,
      mobileData: mobileData
    });
  }

  getLineChartProps(flag) {
    this.getData();
    return {
      width: 720,
      height: 300,
      margin: {
        top: 10, bottom: 50, left: 100, right: 10
      },
      xAxis: {
        label: 'time'
      },
      yAxis: {
        label: flag
      }
    };
  }

  render() {
    return (
      <div className={this.state.isShown ? '' : 'hidden'}>
        <LineChart
          data={this.state.Meminfo}
          {...this.getLineChartProps('Meminfo')}
        />

        <LineChart
          data={this.state.cpu}
          {...this.getLineChartProps('CPU')}
        />

        <LineChart
          data={this.state.ThreadCount}
         {...this.getLineChartProps('ThreadCount')}
        />

        <LineChart
          data={this.state.mobileData}
         {...this.getLineChartProps('MobileTraffic')}
        />

        <LineChart
          data={this.state.wifiData}
          {...this.getLineChartProps('WifiTraffic')}
        />
      </div>
    );
  }
}

ReactDOM.render(<Charts />, document.getElementById('charts'));

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
        if (!d.success) {
          alert(d.errMsg);
        }
        location.reload();
      }
    });
    return false;
  });
  var bash = $('.bash');

  function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  $('.log-export').on('click', function() {
    var text = bash.html();
    var taskTitle = $('.col-md-9 .alert h4')[0].firstChild.nodeValue;
    var taskDate = $('.col-md-9 .clearfix .pull-right')[0].firstChild.nodeValue;
    var result = $('.col-md-3 .build-widget:first-child h4')[0].firstChild.nodeValue;
    var filename = 'reliable-' + taskTitle + '-' + taskDate + '-' + result;
    download(filename, text);
  });

  $(function() {
    $('img').lazyload();
  });

  var modalImage = null;
  $('.bash img').click(function() {
    modalImage = $(this);
    $('#image-modal').modal();
  });

  function isUsingWidth(image) {
    var win = $(window);
    var img = $(image);

    if (win.width() / win.height() < img.width() / img.height()) {
      return true;
    } else {
      return false;
    }
  }

  $('#image-modal').on('show.bs.modal', function() {
    var src = modalImage.attr('data-original');
    var win = $(window);
    var html = '';

    if (isUsingWidth(modalImage)) {
      html += '<img style="width:' + (win.width() - 80) + 'px;" src="' + src + '"/>';
    } else {
      html += '<img style="height:' + (win.height() - 80) + 'px;" src="' + src + '"/>';
    }

    $(this).find('.image').html(html);
  });

  $('#image-modal').on('click.bs.modal', function(event) {
    if (!$(event.target).is('#image-modal img')) {
      $('#image-modal').modal('hide');
    }
  });

  if ($('.build-head').hasClass('alert-info')) {
    // for chrome/safari
    // reference: http://stackoverflow.com/questions/15691569/javascript-issue-with-scrollto-in-chrome
    setTimeout(function() {
      window.scrollTo(0, 99999);
    }, 200);

    setTimeout(function() {
      location.reload();
    }, 10000);
  }

  // sidebar sticky
  $('#affix-sidebar').affix({ offset: { top: 106 } });

})();
