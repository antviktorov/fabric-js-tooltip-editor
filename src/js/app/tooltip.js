var ToolTip = function () {
    "use strict";
    var triangleWidth = 20;
    var triangleHeight = 30;
    var rectDefaultWidth = 200;
    var rectDefaultHalfWidth = rectDefaultWidth * 0.5;
    var rectDefaultHeight = 100;
    var rectDefaultHalfHeight = rectDefaultHeight * 0.5;
    var defaultColor = "#0075a7";
    var angle = 10;
    var triangles = [];
    var availablePositions = ["left", "right", "top", "bottom"];
    var textPadding = 5;
    var textSize = 20;
    var roundRect;

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
            obj.setOriginToCenter();
            resetOrigin = true;
        }

        angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

        obj.set({angle: angle});
        obj.setCoords();

        if (resetOrigin) {
            obj.setCenterToOrigin();
        }

        canvas.renderAll();
    };
    this.alingTextVertically = function(text) {
        text.top = roundRect.top + roundRect.height * 0.5 - text.height * 0.5;
    };
    this._textChanged = function(e) {
        var text = e.target;
        //Decrease font size
        if (text.height > roundRect.height) {
            text.fontSize *= roundRect.height / (text.height + textPadding);
            text.height = roundRect.height - textPadding * 2;
            return;
        }

        //Increase font size
        if (text.fontSize < textSize) {
            text.fontSize *= roundRect.height / (text.height + textPadding);
        }

        //Make text at the center of a rect
        if (text.height < roundRect.height) {
            text.top = roundRect.top + roundRect.height * 0.5 - text.height * 0.5;
        }
    };
    this.addTriangle = function (position) {
        if (availablePositions.indexOf(position) == -1) {
            throw new Error("Available triangles positions are left, right, top, bottom");
        }

        var triangle = new fabric.Triangle({
            width: triangleWidth,
            height: triangleHeight,
        });
        triangle.set({fill: defaultColor});

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
                    top: rectDefaultHeight + triangleHeight,
                    triangle: "bottom",
                });
                break;
            case "left" :
                this._rotateObject(triangle, -90);
                triangle.set({
                    left: 1,
                    top: rectDefaultHalfHeight + triangleWidth * 0.5,
                    triangle: "left"
                });
                break;
            case "right" :
                this._rotateObject(triangle, 90);
                triangle.set({
                    left: rectDefaultWidth + triangleHeight,
                    top: rectDefaultHalfHeight - triangleWidth * 0.5,
                    triangle: "right"
                });
                break;
        }
        triangles.push(triangle);
    };
    this._create = function(options) {
        //TODO make height slightly more then text height
        roundRect = new fabric.Rect({
            top: this._calculateRectTop(),
            left: this._calculateRectLeft(),
            width: rectDefaultWidth,
            height: rectDefaultHeight,
            rx: angle,
            ry: angle,
            fill: defaultColor,
            noScaleCache: false
        });

        var merged = [];
        merged.push(roundRect);
        merged.concat(triangles);

        var text = new fabric.Textbox(options.text, {
            width: roundRect.width - textPadding * 2,
            height: roundRect.height - textPadding * 2,
            left: roundRect.left + textPadding,
            fontSize: textSize,
            textAlign: 'center',
            fontFamily: 'arial',
            fill: "white"
        });

        this.alingTextVertically(text);

        text.on('changed', this._textChanged);

        var group = new fabric.Group([roundRect].concat(triangles).concat([text]), {
            left: options.left,
            top: options.top,
            lockUniScaling: true
        });

        canvas.renderAll();

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