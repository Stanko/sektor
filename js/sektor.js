'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function Sektor(selector, options) {
  this.element = document.querySelector(selector);

  var defaultOptions = {
    size: 100,
    stroke: 10,
    arc: false,
    angle: 225,
    sectorColor: '#789',
    circleColor: '#DDD',
    fillCircle: true
  };

  // Merge options with default ones
  options = _extends(defaultOptions, options);

  // Reset stroke to 0 if drawing full sector
  options.stroke = options.arc ? options.stroke : 0;

  // Circle dimenstions
  options.center = options.size / 2;
  options.radius = options.stroke ? options.center - options.stroke / 2 : options.center;

  this.options = options;

  this.checkAngle();

  var svg = '<svg class=\'Sektor\' viewBox=\'0 0 ' + options.size + ' ' + options.size + '\'>\n      ' + this.getCircle() + '\n      ' + this.getSector() + '\n    </svg>';

  this.element.innerHTML = svg;
  this.sector = this.element.querySelector('.Sektor-sector');
}

Sektor.prototype.checkAngle = function () {
  if (this.options.angle > 360) {
    this.options.angle = this.options.angle % 360;
  }
};

Sektor.prototype.changeAngle = function (angle) {
  this.options.angle = angle;
  this.checkAngle();
  this.sector.setAttribute('d', this.getSector(true));
};

Sektor.prototype.step = function (angleOffset, endAngle, time, endTime) {
  var _this = this;

  var now = new Date().valueOf();
  var timeOffset = endTime - now;

  if (timeOffset <= 0) {
    this.changeAngle(endAngle);
  } else {
    var angle = endAngle - angleOffset * timeOffset / time;

    this.changeAngle(angle);
    requestAnimationFrame(function () {
      return _this.step(angleOffset, endAngle, time, endTime);
    });
  }
};

Sektor.prototype.animateTo = function (angle) {
  var _this2 = this;

  var time = arguments.length <= 1 || arguments[1] === undefined ? 300 : arguments[1];

  if (angle > 360) {
    angle = angle % 360;
  }

  var startTime = new Date().valueOf();
  var endTime = startTime + time;
  var angleOffset = angle - this.options.angle;

  requestAnimationFrame(function () {
    return _this2.step(angleOffset, angle, time, endTime);
  });
};

Sektor.prototype.getSector = function () {
  var returnD = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

  var options = this.options;

  // Colors
  var sectorFill = options.arc ? 'none' : options.sectorColor;
  var sectorStroke = options.arc ? options.sectorColor : 'none';

  // Arc angles
  var firstAngle = options.angle > 180 ? 90 : options.angle - 90;
  var secondAngle = -270 + options.angle - 180;

  // Arcs
  var firstArc = this.getArc(firstAngle, options);
  var secondArc = options.angle > 180 ? this.getArc(secondAngle, options) : '';

  // start -> starting line
  // end -> will path be closed or not
  var end = '';
  var start = null;

  if (options.arc) {
    start = 'M' + options.center + ',' + options.stroke / 2;
  } else {
    start = 'M' + options.center + ',' + options.center + ' L' + options.center + ',' + options.stroke / 2;
    end = 'z';
  }

  var d = start + ' ' + firstArc + ' ' + secondArc + ' ' + end;

  if (returnD) {
    return d;
  }

  return '<path\n    class=\'Sektor-sector\'\n    stroke-width=\'' + options.stroke + '\'\n    fill=' + sectorFill + '\n    stroke=' + sectorStroke + '\n    d=\'' + d + '\' />';
};

Sektor.prototype.getCircle = function () {
  var options = this.options;
  var circleFill = options.fillCircle || !options.arc ? options.circleColor : 'none';

  return '<circle\n      class=\'Sektor-circle\'\n      stroke-width=\'' + options.stroke + '\'\n      fill=' + circleFill + '\n      stroke=' + options.circleColor + '\n      cx=\'' + options.center + '\'\n      cy=\'' + options.center + '\'\n      r=\'' + options.radius + '\' />';
};

// Generates SVG arc string
Sektor.prototype.getArc = function (angle) {
  var options = this.options;

  var x = options.center + options.radius * Math.cos(this.radians(angle));
  var y = options.center + options.radius * Math.sin(this.radians(angle));

  return 'A' + options.radius + ',' + options.radius + ' 1 0 1 ' + x + ',' + y;
};

// Converts from degrees to radians.
Sektor.prototype.radians = function (degrees) {
  return degrees / 180 * Math.PI;
};
