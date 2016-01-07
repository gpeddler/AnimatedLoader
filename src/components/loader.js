import React from 'react';
import ReactDOM from 'react-dom';

export default class Test extends React.Component {
    constructor(props) {
        super(props);

        this.radius = parseInt(props.radius);
        this.padding = 30;
        this.color = [
            [40, 235, 169],
            [67, 205, 245]
        ];
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this);
        let context = canvas.getContext('2d');

        this.screen = {
            width: canvas.width,
            height: canvas.height
        };

        this._initCanvas();
        this._timer = setInterval(this._updateCanvas.bind(this, context), 33);
    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }

    render() {
        let size = (this.radius + this.padding) * 2 + "px";

        return (
            <canvas className="test" width={ size } height={ size } />
        );
    }

    _initCanvas() {
        this._ticker = 0;

        this._dot = {
            x: 0,
            y: 0,
            radius: this.radius,
            speed: 3,
            tail_size: 15,
            tails: []
        };

        this._circle = {
            x: this.screen.width / 2,
            y: this.screen.height / 2,
            radius: this.radius,
            thickness: 4
        };
    }

    _updateCanvas(context) {
        this._ticker ++;

        if (this._dot.tails.length >= this._dot.tail_size) {
            this._dot.tails.splice(0, 1);
        }

        if (this._dot.x != 0) {
            this._dot.tails.push({
                x: this._dot.x,
                y: this._dot.y
            });
        }

        let angle = this._ticker * this._dot.speed * Math.PI / 180;
        this._dot.x = this.radius * Math.cos(angle) + this.screen.width / 2;
        this._dot.y = this.radius * Math.sin(angle) + this.screen.height / 2;

        this._drawCanvas(context);
    }

    _drawCanvas(context) {
        context.clearRect(0, 0, this.screen.width, this.screen.height);

        // circle
        this._drawCircle(context);

        // light of circle
        this._drawBlurCircle(context, 10, 0.09);

        // light on circle
        this._drawCircleLight(context);

        // dot
        this._drawDot(context);

        context.font = "37px Arial";
        context.fillStyle = "#d2d2d2";
        context.textAlign = "center";
        context.fillText("FNIAX", this.screen.width / 2, this.screen.height / 2 + 13);
    }

    _drawCircle(context) {
        context.beginPath();

        context.arc(this._circle.x, this._circle.y, this._circle.radius, 0, Math.PI * 2, false);
        context.lineWidth = this._circle.thickness;
        context.strokeStyle = this._toRGB(this.color[1], 1);
        context.stroke();

        context.closePath();
    }

    _drawCircleLight(context) {
        context.globalCompositeOperation = "source-atop";

        let gradient = context.createRadialGradient(this._dot.x, this._dot.y, 0, this._dot.x, this._dot.y, 200);
        gradient.addColorStop(0, this._toRGB(this.color[0], 1));
        gradient.addColorStop(1, this._toRGB(this.color[0], 0));

        context.beginPath();
        context.arc(this._dot.x, this._dot.y, 200, 0, Math.PI * 2, false);
        context.fillStyle = gradient;
        context.fill();
        context.closePath();

        context.globalCompositeOperation = "source-over";
    }

    _drawBlurCircle(context, size, alpha) {
        context.beginPath();

        for (let i = 1; i <= size; i++) {

            context.arc(this._circle.x, this._circle.y, this._circle.radius - i, 0, Math.PI * 2, false);
            context.lineWidth = this._circle.thickness;
            context.strokeStyle = this._toRGB(this.color[1], (alpha - alpha * (i / size)).toFixed(2));
            context.stroke();

            context.arc(this._circle.x, this._circle.y, this._circle.radius + i, 0, Math.PI * 2, false);
            context.lineWidth = this._circle.thickness;
            context.strokeStyle = this._toRGB(this.color[1], (alpha - alpha * (i / size)).toFixed(2));
            context.stroke();

        }

        context.closePath();
    }

    _drawDot(context) {
        let gradient = context.createRadialGradient(this._dot.x, this._dot.y, 0, this._dot.x, this._dot.y, 6);
        gradient.addColorStop(0, this._toRGB(this.color[0], 1));
        gradient.addColorStop(0.8, this._toRGB(this.color[0], 1));
        gradient.addColorStop(1, this._toRGB(this.color[0], 0));

        context.beginPath();
        context.arc(this._dot.x, this._dot.y, 6, 0, Math.PI * 2, false);
        context.fillStyle = gradient;
        context.fill();
        context.closePath();

        this._dot.tails.forEach((position, i) => {
            context.beginPath();
            context.arc(position.x, position.y, 6, 0, Math.PI * 2, false);
            context.fillStyle = this._toRGB(this.color[0], (i / this._dot.tail_size).toFixed(2));
            context.fill();
            context.closePath();
        });
    }

    _toRGB(array, alpha) {
        return "rgba(" + array[0] + "," + array[1] + "," + array[2] + "," + alpha + ")";
    }
}

Test.Proptypes = {
    radius: React.PropTypes.string.isRequired
};