"use strict";

var canvas = global.canvas;
var ToolTip = require('./tooltip.js');
var utils = new (require('./fabricUtils.js'))();

function init() {
    disablePanel();
}

function getSplitActiveObject() {
    var object = canvas.getActiveObject();
    return {
        triangle: object.getObjects('triangle')[0],
        rect: object.getObjects("rect")[0],
        caption: object.getObjects("textbox")[0]
    };
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

    deactivateAling();
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
        objects.caption.fire("changed", {target: objects.caption});
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
    //Set triangle position
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
    //Set text value
    $(".form-control").val(objects.caption.text);

    //Set button color the same as
    var color = objects.triangle.get("fill");

    //Color button
    $(".btn-color").css("background-color", color);
    $(".btn-color").css("border-color", color);

    //Text align
    deactivateAling();
    $(".btn-align-" + objects.caption.get("textAlign")).addClass('active');

    //Text style
    deactivateStyle();
    if (objects.caption.get('fontStyle') === "bold" ) {
        $(".btn-style-bold").addClass('active');
    }

    //Underline
    if (objects.caption.get('underline')) {
        $(".btn-underline").addClass('active');
    } else {
        $(".btn-underline").removeClass('active');
    }
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

function deactivateAling() {
    $(".btn-align").each(function() {
        $(this).removeClass("active");
    });
}

function deactivateStyle() {
    $(".btn-style").each(function() {
        $(this).removeClass("active");
    });
}

function toogleStyle(object, style) {
    var objects = getSplitActiveObject();

    if ($(object).hasClass('active')) {
        objects.caption.set({fontStyle: 'normal'});
        deactivateStyle();
    } else {
        objects.caption.set({fontStyle: style});
        deactivateStyle();
        $(object).addClass('active');
    }
}

function getCanvasCenter() {
    var position = $(".canvas-container").position();
    position.left *= -1;
    position.top *= -1;
    position.left += $(".canvas-wrapper-container").width();
    position.top += $(".canvas-wrapper-container").height();
    position.left *= 0.5;
    position.top *= 0.5;
    return position;
}

function showTextarea() {
    $(".text-container").show(500);
}

function hideTextarea() {
    $(".text-container").hide(500);
}

function listeners() {
    // Canvas event listeners
    canvas.on({
        "object:selected": function () {
            enablePanel();
            initPanel();
            showTextarea();
        },
        "selection:updated": function () {
            initPanel();
        },
        "selection:cleared": function () {
            disablePanel();
            hideTextarea();
        }
    });

    /**
     * Add tooltip buttons.
     */
    $(".btn-add").on("click", function () {
        var toolTip = new ToolTip();
        var group;

        var position = getCanvasCenter();
        position.text = "Tooltip Hint";

        if ($(this).hasClass("btn-add-top")) {
            group = toolTip.createTop(position);
        }

        if ($(this).hasClass("btn-add-down")) {
            group = toolTip.createBottom(position);
        }

        if ($(this).hasClass("btn-add-left")) {
            group = toolTip.createLeft(position);
        }

        if ($(this).hasClass("btn-add-right")) {
            group = toolTip.createRight(position);
        }

        if (group) {
            utils.setShadow('rgba(0,0,0,0.3)', 10, 5, 5, group);
            canvas.add(group);
        }
    });

    $(".btn-settings").on("click", function () {
        var objects = getSplitActiveObject();
        if ($(this).hasClass("btn-align-left")) {
            objects.caption.set({textAlign: 'left'});
            deactivateAling();
            $(this).addClass("active");
        }
        if ($(this).hasClass("btn-align-center")) {
            objects.caption.set({textAlign: 'center'});
            deactivateAling();
            $(this).addClass("active");
        }
        if ($(this).hasClass('btn-align-right')) {
            objects.caption.set({textAlign: 'right'});
            deactivateAling();
            $(this).addClass("active");
        }

        if ($(this).hasClass('btn-style-bold')) {
            toogleStyle(this, 'bold');
        }

        if ($(this).hasClass('btn-style-italic')) {
            toogleStyle(this, 'italic');
        }

        if ($(this).hasClass('btn-underline')) {
            if ($(this).hasClass('active')) {
                objects.caption.set({underline: false});
                $(this).removeClass('active');
            } else {
                objects.caption.set({underline: true});
                $(this).addClass('active');
            }
        }

        canvas.renderAll();
    });

    $(".btn-remove").on("click", function () {
        utils.deleteSelected();
    });
}

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

    /*canvas.on('text:changed', function(opt) {
        console.log(opt);
        var t1 = opt.target;
        if (t1.width > t1.fixedWidth) {
            t1.fontSize *= t1.fixedWidth / (t1.width + 1);
            t1.width = t1.fixedWidth;
        }
    });*/
}

module.exports = HandlersModule;