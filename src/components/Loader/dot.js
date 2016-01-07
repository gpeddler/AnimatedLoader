import React from 'react';
import ReactDOM from 'react-dom';

export default class Dot extends React.Component {
    constructor(props) {
        super(props);

        this.radius = parseInt(props.radius);
        this.padding = props.padding | 0;
        this.color = props.color;
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
            <canvas className="loader--dot" width={ size } height={ size } />
        );
    }

    _initCanvas() {
        this._ticker = 0;
        this._dot = {
            x: 0,
            y: 0,
            radius: this.radius,
            speed: 3
        };
    }

    _updateCanvas(context) {
        this._ticker ++;

        let angle = this._ticker * this._dot.speed * Math.PI / 180;
        this._dot.x = this.radius * Math.cos(angle) + this.screen.width / 2;
        this._dot.y = this.radius * Math.sin(angle) + this.screen.height / 2;

        this._drawCanvas(context);
    }

    _drawCanvas(context) {
        //context.fillStyle = "rgba(255,255,255,0.05)";
        //context.fillRect(0, 0, this.screen.width, this.screen.height);
        //context.clearRect(0, 0, this.screen.width, this.screen.height);
        context.globalCompositeOperation

        context.beginPath();

        context.arc(this._dot.x, this._dot.y, 5, 0, Math.PI * 2, false);
        context.fillStyle = this._toRGB(this.color, 1);
        context.fill();

        context.closePath();
    }

    _toRGB(array, alpha) {
        return "rgba(" + array[0] + "," + array[1] + "," + array[2] + "," + alpha + ")";
    }
}

Dot.Proptypes = {
    radius: React.PropTypes.string.isRequired,
    color: React.PropTypes.array.isRequired,
    padding: React.PropTypes.number
};