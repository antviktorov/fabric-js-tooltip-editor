"use strict";

var canvas = global.canvas;
var ToolTip = require('./tooltip.js');
var utils = new (require('./fabricUtils.js'))();

function init() {
    disablePanel();
}

function disablePanel() {
    $(".btn-arrow-postion > button").each(function() {
        $(this).addClass("disabled");
        $(this).removeClass("active");
    });
    $(".btn-color").addClass("disabled");
    $(".btn-settings > button").each(function() {
        $(this).addClass("disabled");
    });
    $(".form-control").attr("disabled", "disabled");
    $(".form-control").text("");

    $(".btn-remove").addClass("disabled");
    $(".form-control").val("");
}

function enablePanel() {
    $(".btn-arrow-postion > button").each(function() {
        $(this).removeClass("disabled");
    });
    $(".btn-color").removeClass("disabled");
    $(".btn-settings > button").each(function() {
        $(this).removeClass("disabled");

    });
    $(".form-control").removeAttr("disabled");
    $(".btn-remove").removeClass("disabled");

    $(".form-control").on("keyup", function (e) {
        var toolTip = canvas.getActiveObject();
        var caption = (toolTip.getObjects())[2];
        caption.set("text", e.target.value);
        canvas.renderAll();
    });
}

function initPanel() {
    var toolTip = canvas.getActiveObject();
    var triangle = (toolTip.getObjects())[1];
    var caption = (toolTip.getObjects())[2];
    switch (triangle.triangle) {
        case "left" :
            $(".btn-arrow-postion > button:nth-child(1)").addClass('active');
            break;
        case "right" :
            $(".btn-arrow-postion > button:nth-child(2)").addClass('active');
            break;
        case "top" :
            $(".btn-arrow-postion > button:nth-child(3)").addClass('active');
            break;
        case "bottom" :
            $(".btn-arrow-postion > button:nth-child(4)").addClass('active');
            break;
    }
    $(".form-control").val(caption.text);
}

function deleteHandler() {
    // Handler for the delete and backspace keys
    $(document).on("keyup", function (e) {
        if (e.which == 46 || e.which == 8) {
            // Block the functionality if user is entering text
            var active = $(document.activeElement);
            if (active.is('input,textarea,text,password,file,email,search,tel,date')) {
                return;
            }

            utils.deleteSelected();
            e.preventDefault();
        }
    });

}

function listeners() {
    // Set event listeners
    canvas.on({
        "object:selected": function () {
            enablePanel();
            initPanel();
        },
        "selection:updated": function () {
            initPanel();
        },
        "selection:cleared": function () {
            disablePanel();
        }
    });

    $(".btn-add").on("click", function () {
        var toolTip = new ToolTip();
        var group = toolTip.createTop({top: 200, left: 100, text: "Tooltip Hint"});
        canvas.add(group);
    });

    $(".btn-arrow-postion").on("click", function () {
        console.log("Arrow click!");
    });

    $(".btn-settings").on("click", function () {
        console.log("Settings click!");
    });

    $(".btn-remove").on("click", function () {
        utils.deleteSelected();
    });

    // Export panel

    /*$("#download-image-button").on("click", function() {
     var type = $("input[name=file-type]:checked").val();
     var background = $("input[name=background-color]:checked").val();

     var rect;
     if (background === 'white' || type === 'jpeg') {
     if (type === 'png' || type === 'jpeg') {
     canvas.setBackgroundColor("#FFFFFF");
     canvas.renderAll();
     } else {
     rect = new fabric.Rect({
     left: 0,
     top: 0,
     fill: 'white',
     width: canvas.width,
     height: canvas.height
     });
     canvas.add(rect);
     canvas.sendToBack(rect);
     canvas.renderAll();
     }
     }*/

    //utils.exportFile(type);

    // Cleanup background
    /*if (background === 'white' || type === 'jpeg') {
     if (type === 'png' || type === 'jpeg') {
     canvas.setBackgroundColor("");
     } else {
     canvas.remove(rect);
     }
     canvas.renderAll();
     }
     });*/

    /*$("#export-file-button").on("click", function() {
     // Broken in Safari
     var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
     navigator.userAgent && !navigator.userAgent.match('CriOS');
     if (isSafari === true) {
     window.alert("Sorry, Safari does not support exporting your work. You can still use the sharing tool instead!");
     return;
     }

     var data = JSON.stringify(canvas);
     importExport.exportFile(data, 'design.logo');
     });*/
}

/* ----- exports ----- */

function HandlersModule() {
    if (!(this instanceof HandlersModule)) return new HandlersModule();

    init();

    // Initialize canvas
    fabric.Object.prototype.transparentCorners = false;

    // Change fabric.js selection styles
    fabric.Object.prototype.set({
        borderColor: "#1c55d5",
        cornerColor: "#1c55d5",
        cornerSize: 8,
        rotatingPointOffset: 30
    });

    // Preserve object layer order when selecting objects
    canvas.preserveObjectStacking = true;

    // Setup handlers
    deleteHandler();
    listeners();

    // Undo redo
    /*canvas.on("object:modified", function () {
     // state.save();
     });

     canvas.on("object:removed", function () {
     // state.save();
     });

     canvas.on("object:statechange", function () {
     //state.save();
     });*/
}

module.exports = HandlersModule;


/*function rightClick() {
 // Setup right-click context menu
 $.contextMenu({
 selector: '#content',
 trigger: 'right',
 animation: { duration: 0 },
 callback: function(itemKey, opt){
 if (itemKey === "delete") {
 utils.deleteSelected();
 } else if (itemKey === "forward") {
 utils.sendForward();
 } else if (itemKey === "front") {
 utils.sendToFront();
 } else if (itemKey === "backward") {
 utils.sendBackward();
 } else if (itemKey === "back") {
 utils.sendToBack();
 } else if (itemKey === "clone") {
 utils.clone();
 }
 },
 items: {
 "forward": {name: "Bring Forward"},
 "front": {name: "Bring to Front"},
 "backward": {name: "Send Backward"},
 "back": {name: "Send to Back"},
 "sep1": "---------",
 "clone": {name: "Clone"},
 "sep2": "---------",
 "delete": {name: "Delete"}
 }
 });

 // Bind right-click menu
 $('#content').on('contextmenu.custom', function (e) {
 var target = canvas.findTarget(e.e);
 if (target !== null && target !== undefined) {
 canvas.setActiveObject(target);
 return true;
 }
 return false;
 });
 }*/

/*function showCurrentFont() {
 var font = toTitleCase(utils.getFont());
 if (font.length > 9) {
 font = font.substring(0,10) + "...";
 }
 $("#current-font").text(font);
 }*/

/*function showActiveTools() {
 if (isAppLoading === true) {
 return;
 }

 var tools = $("#active-tools");
 var obj = canvas.getActiveObject();

 if (canvas.getActiveObjects() !== null && canvas.getActiveObjects() !== undefined) {
 $("#active-tools > div").addClass("noshow");
 tools.removeClass("noshow");
 $("div.group", tools).removeClass("noshow");
 } else if (obj !== null && obj !== undefined) {
 $("#active-tools > div").addClass("noshow");
 tools.removeClass("noshow");

 var type = canvas.getActiveObject().type;
 if (type === "i-text") {
 $("div.text", tools).removeClass("noshow");

 if (text.isBold(obj)) {
 $("#toolbar-bold").addClass("toolbar-item-active");
 } else {
 $("#toolbar-bold").removeClass("toolbar-item-active");
 }

 if (text.isItalics(obj)) {
 $("#toolbar-italics").addClass("toolbar-item-active");
 } else {
 $("#toolbar-italics").removeClass("toolbar-item-active");
 }

 if (text.isUnderline(obj)) {
 $("#toolbar-underline").addClass("toolbar-item-active");
 } else {
 $("#toolbar-underline").removeClass("toolbar-item-active");
 }

 showCurrentFont();

 } else if (type === "svg") {
 $("div.svg", tools).removeClass("noshow");
 } else {
 $("div.shape", tools).removeClass("noshow");
 }

 // Init fill color picker
 page.fillColorPicker();
 var color = utils.getFillColor();
 if (color && color !== "") {
 $("#toolbar-fill-color").spectrum("set", color);
 }

 // Init outline color picker
 page.outlineColorPicker();
 var outlineColor = utils.getOutlineColor();
 if (outlineColor && outlineColor !== "") {
 $("#toolbar-outline-color").spectrum("set", outlineColor);
 }

 // Shadow and glow
 setCurrentShadowValues();
 page.glowColorPicker();
 page.shadowColorPicker();

 } else {
 hideActiveTools();
 }
 }*/
