"use strict";

var canvas = global.canvas;
var ToolTip = require('./tooltip.js');
var utils = new (require('./fabricUtils.js'))();

function init() {
    disablePanel();
}

function getSplitActiveObject() {
    var object = canvas.getActiveObject();
    var objects = object.getObjects();
    return {
        triangle: objects[0],
        rect: objects[1],
        caption: objects[2]
    }
}

function disablePanel() {
    $(".btn-arrow-postion > button").each(function () {
        $(this).addClass("disabled");
        $(this).removeClass("active");
    });
    $(".btn-color").addClass("disabled");
    $(".btn-settings > button").each(function () {
        $(this).addClass("disabled");
    });
    $(".form-control").attr("disabled", "disabled");
    $(".form-control").text("");

    $(".btn-remove").addClass("disabled");
    $(".form-control").val("");

    $(".btn-color").colorpicker("destroy");
}

function enablePanel() {
    $(".btn-arrow-postion > button").each(function () {
        $(this).removeClass("disabled");
    });
    $(".btn-color").removeClass("disabled");
    $(".btn-settings > button").each(function () {
        $(this).removeClass("disabled");

    });
    $(".form-control").removeAttr("disabled");
    $(".btn-remove").removeClass("disabled");

    $(".form-control").on("keyup", function (e) {
        var objects = getSplitActiveObject();
        objects.caption.set("text", e.target.value);
        canvas.renderAll();
    });

    $(".btn-color")
        .colorpicker({debug: true})
        .on('changeColor', function (e) {

            var color = e.color.toHex();

            $(".btn-color").css("background-color", color);
            $(".btn-color").css("border-color", color);

            var objects = getSplitActiveObject();
            objects.triangle.set({fill: color});
            objects.rect.set({fill: color});

            canvas.renderAll();
        });
}

function initPanel() {
    var objects = getSplitActiveObject();
    switch (objects.triangle.triangle) {
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
    $(".form-control").val(objects.caption.text);

    //Set button color the same as
    var color = objects.triangle.get("fill");

    $(".btn-color").css("background-color", color);
    $(".btn-color").css("border-color", color);
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