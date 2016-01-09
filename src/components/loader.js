import React from 'react';
import ReactDOM from 'react-dom';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.radius = 100;
        this.padding = 30;

        this.speed = props.speed;
        this.text = props.text;
        this.color = props.colors;
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this);
        let context = canvas.getContext('2d');

        this.screen = {
            width: canvas.width,
            height: canvas.height
        };

        this._initCanvas();
        requestAnimationFrame(this._updateCanvas.bind(this, context));
    }

    render() {
        let size = (this.radius + this.padding) * 2 + "px";

        return (
            <canvas className="test" width={ size } height={ size } />
        );
    }

    _initCanvas() {
        this._angle = this._toRadian(270);

        this._dot = {
            x: 0,
            y: 0,
            radius: this.radius,
            speed: this.speed,
            tail_size: 30,
            tails: []
        };

        this._circle = {
            x: this.screen.width / 2,
            y: this.screen.height / 2,
            radius: this.radius,
            thickness: 4,
            spread: []
        };
    }

    _updateCanvas(context) {
        this._angle += this._toRadian(this._dot.speed);
        if (this._dot.speed < this.speed) {
            this._dot.speed = this.speed;
        }

        let remove = [];
        this._circle.spread.forEach((radius, i) => {
            this._circle.spread[i] = radius + 0.2;
            if (radius + 1 > this.radius + this.padding) {
                remove.push(i);
            }
        });

        remove.forEach((index) => {
            this._circle.spread.splice(index, 1);
        });

        for (let i = 0; i < this._dot.tail_size; i++) {
            let angle_tail = this._angle - this._toRadian(this._dot.tail_size - i - 1) * this._dot.speed / 2;
            this._dot.tails[i] = {
                x: this.radius * Math.cos(angle_tail) + this.screen.width / 2,
                y: this.radius * Math.sin(angle_tail) + this.screen.width / 2
            }
        }

        this._dot.x = this.radius * Math.cos(this._angle) + this.screen.width / 2;
        this._dot.y = this.radius * Math.sin(this._angle) + this.screen.height / 2;

        if (this._toDegree(this._angle) > 270 || this._toDegree(this._angle) < 90) {
            this._dot.speed += 0.1;
        } else {
            this._dot.speed -= 0.1;
        }

        // Circle Spread
        if (this._toDegree(this._angle) < 270 && this._toDegree(this._angle) + this._dot.speed >= 270) {
            this._circle.spread.push(this._circle.radius);
        }

        this._drawCanvas(context);
        requestAnimationFrame(this._updateCanvas.bind(this, context));
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
        context.fillText(this.text, this.screen.width / 2, this.screen.height / 2 + 13);
    }

    _drawCircle(context) {
        context.beginPath();

        context.arc(this._circle.x, this._circle.y, this._circle.radius, 0, Math.PI * 2, false);
        context.lineWidth = this._circle.thickness;
        context.strokeStyle = this._toRGB(this.color[1], 1);
        context.stroke();

        context.closePath();

        this._circle.spread.forEach((radius) => {
            context.beginPath();
            context.arc(this._circle.x, this._circle.y, radius, 0, Math.PI * 2, false);
            context.lineWidth = 1;
            context.strokeStyle = this._toRGB(this.color[1], (1 - (radius - this._circle.radius) / this.padding).toFixed(2));
            context.stroke();
            context.closePath();
        });
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

    _toRadian(degree) {
        return (degree % 360) * Math.PI / 180;
    }

    _toDegree(radian) {
        return (radian * 180 / Math.PI) % 360;
    }
}

Loader.Proptypes = {
    speed: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    colors: React.PropTypes.array.isRequired
};