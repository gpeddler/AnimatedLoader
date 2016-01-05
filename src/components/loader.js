import React from 'react';
import ReactDOM from 'react-dom';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.width = parseInt(props.width);
        this.height = parseInt(props.height);

        this.color_dot = [40, 235, 169];
        this.color_circle = [67, 205, 245];
    }

    componentDidMount() {
        let canvas = ReactDOM.findDOMNode(this);
        let context = canvas.getContext('2d');

        this._initCanvas();
        this._timer = setInterval(this._updateCanvas.bind(this, context), 33);
    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }

    render() {
        return (
            <canvas className="loader" width="500px" height="500px" />
        );
    }

    _initCanvas() {
        this.ticker = 0;

        this.dot = {
            x: 0,
            y: 0,
            speed: 3,
            radius: 7,
            color: this.color_dot
        }
    }

    _updateCanvas(context) {
        this.ticker ++;

        let radius = this.width / 2 - this.dot.radius;
        let angle = this.ticker * this.dot.speed * Math.PI / 180;

        this.dot.x = radius * Math.cos(angle) + this.width / 2;
        this.dot.y = radius * Math.sin(angle) + this.width / 2;

        this._drawCanvas(context);
    }

    _drawCanvas(context) {
        context.fillStyle = "rgba(255,255,255,0.05)";
        context.fillRect(0, 0, this.width, this.height);

        // Dot
        let gradient = context.createRadialGradient(this.dot.x, this.dot.y, 0, this.dot.x, this.dot.y, this.dot.radius);
        gradient.addColorStop(0, this._toRGB(this.dot.color, 1));
        gradient.addColorStop(0.8, this._toRGB(this.dot.color, 1));
        gradient.addColorStop(1, this._toRGB(this.dot.color, 0));

        context.beginPath();
        context.arc(this.dot.x, this.dot.y, this.dot.radius, 0, Math.PI * 2, true);
        context.fillStyle = gradient;
        context.fill();
        context.closePath();
    }

    _toRGB(array, alpha) {
        return "rgba(" + array[0] + "," + array[1] + "," + array[2] + "," + alpha + ")";
    }
}

Loader.Proptypes = {
    width: React.PropTypes.string.isRequired,
    height: React.PropTypes.string.isRequired
};