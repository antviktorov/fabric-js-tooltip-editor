global.jQuery = require('jquery');
global.$ = global.jQuery;

require('fabric');

var ToolTip = require('./app/tooltip.js');

$(function() {
  "use strict";
	global.canvas = new fabric.Canvas('tooltip-canvas');

	var toolTip = new ToolTip();
	var group = toolTip.createTop({top: 200, left: 100});
	canvas.add(group);
});
