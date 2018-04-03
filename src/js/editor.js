global.jQuery = require('jquery');
global.$ = global.jQuery;

require('fabric');
require('./app/objects/tooltip.group.class.js');

$(function() {
  "use strict";
	function add() {
		var red = new fabric.Rect({
			top: 100, left: 0, width: 80, height: 50, fill: 'red' });
		var blue = new fabric.Rect({
			top: 0, left: 100, width: 50, height: 70, fill: 'blue' });
		var green = new fabric.Rect({
			top: 100, left: 100, width: 60, height: 60, fill: 'green' });
		canvas.add(red, blue, green);
	}

	global.canvas = new fabric.Canvas('tooltip-canvas');
	add();

	var toolTip = new fabric.ToolGroup(
		{
			width: 300,
			height: 200,
			left: 100,
			top: 50
		}
	);

	canvas.add(toolTip);
	//new (require('./app/handlers.js'))();
});
