var ToolTip = function () {
    "use strict";
    var triangleWidth = 20;
    var triangleHeight = 30;
    var rectDefaultWidth = 300;
    var rectDefaultHalfWidth = rectDefaultWidth * 0.5;
    var rectDefaultHeight = 200;
    var rectDefaultHalfHeight = rectDefaultHeight * 0.5;
    var color = "green";
    var angle = 10;
    var triangles = [];
    var availablePositions = ["left", "right", "top", "bottom"];

    this._calculateRectWidth = function() {
        var result = rectDefaultWidth;
        for (var i = 0; i < triangles.length; i++) {
            if (triangles[i].triangle == "left" || triangles[i].triangle == "right") {
                result -= triangleHeight;
            }
        }
        return result;
    };
    this._calculateRectHeight = function() {
        var result = rectDefaultHeight;
        for (var i = 0; i < triangles.length; i++) {
            if (triangles[i].triangle == "top" || triangles[i].triangle == "bottom") {
                result -= triangleHeight;
            }
        }
        return result;
    };
    this._calculateRectTop = function() {
        for (var i = 0; i < triangles.length; i++) {
            if (triangles[i].triangle == "top") {
                return triangleHeight;
            }
        }
        return 0;
    };
    this._calculateRectLeft = function() {
        for (var i = 0; i < triangles.length; i++) {
            if (triangles[i].triangle == "left") {
                return triangleHeight;
            }
        }
        return 0;
    };
    this._rotateObject = function (obj, angleOffset) {
        var resetOrigin = false;

        var angle = obj.angle + angleOffset;

        if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
            obj.setOriginToCenter && obj.setOriginToCenter();
            resetOrigin = true;
        }

        angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

        obj.set({angle: angle});
        obj.setCoords();

        if (resetOrigin) {
            obj.setCenterToOrigin && obj.setCenterToOrigin();
        }

        canvas.renderAll();
    };
    this.addTriangle = function (position) {
        if (availablePositions.indexOf(position) == -1) {
            throw new Error("Available triangles positions are left, right, top, bottom");
        }

        var triangle = new fabric.Triangle({
            width: triangleWidth,
            height: triangleHeight,
        });
        triangle.set({fill: color});

        switch (position) {
            case "top" :
                triangle.set({
                    left: rectDefaultHalfWidth - triangleWidth * 0.5,
                    top: 1,
                    triangle: "top",
                });
                break;
            case "bottom" :
                this._rotateObject(triangle, 180);
                triangle.set({
                    left: rectDefaultHalfWidth + triangleWidth * 0.5,
                    top: rectDefaultHeight,
                    triangle: "bottom",
                });
                break;
            case "left" :
                this._rotateObject(triangle, -90);
                triangle.set({
                    left: 0,
                    top: rectDefaultHalfHeight + triangleWidth * 0.5,
                    triangle: "left"
                });
                break;
            case "right" :
                this._rotateObject(triangle, 90);
                triangle.set({
                    left: rectDefaultWidth,
                    top: rectDefaultHalfHeight - triangleWidth * 0.5,
                    triangle: "right"
                });
                break;
        }
        triangles.push(triangle);
    };
    this._create = function(options) {
        var roundRect = new fabric.Rect({
            top: this._calculateRectTop(),
            left: this._calculateRectLeft(),
            width: this._calculateRectWidth(),
            height: this._calculateRectHeight(),
            rx: angle,
            ry: angle,
            fill: color
        });

        var group = new fabric.Group([roundRect].concat(triangles), {
            left: options.left,
            top: options.top,
         });

         return group;
    };
    this.createLeft = function(options) {
        this.addTriangle("left");
        return this._create(options);
    };
    this.createRight = function(options) {
        this.addTriangle("right");
        return this._create(options);
    };
    this.createTop = function(options) {
        this.addTriangle("top");
        return this._create(options);
    };
    this.createBottom = function(options) {
        this.addTriangle("bottom");
        return this._create(options);
    };
};

module.exports = ToolTip;