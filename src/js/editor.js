global.jQuery = require('jquery');
global.$ = global.jQuery;

require('fabric');
require('bootstrap-colorpicker');

$(function() {
  "use strict";
	global.canvas = new fabric.Canvas('tooltip-canvas');
	new (require('./app/handlers.js'))();
});