import React from 'react';
import ReactDOM from 'react-dom';

export default class Circle extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);

        this.radius = props.radius;
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
        this._drawCanvas(context);
    }

    render() {
        let size = (this.radius + this.padding) * 2 + "px";

        return (
            <canvas className="loader--circle" width={ size } height={ size } />
        );
    }

    _initCanvas() {
        this._circle = {
            x: this.screen.width / 2,
            y: this.screen.height / 2,
            radius: this.radius,
            thickness: 4
        };
    }

    _drawCanvas(context) {
        context.beginPath();

        context.arc(this._circle.x, this._circle.y, this._circle.radius, 0, Math.PI * 2, false);
        context.lineWidth = this._circle.thickness;
        context.strokeStyle = this._toRGB(this.color, 1);
        context.stroke();

        context.closePath();

        this._drawBlurCircle(context, 10, 0.09);
    }

    _drawBlurCircle(context, size, alpha) {
        context.beginPath();

        for (let i = 1; i <= size; i++) {
            context.arc(this._circle.x, this._circle.y, this._circle.radius - i, 0, Math.PI * 2, false);
            context.lineWidth = this._circle.thickness;
            context.strokeStyle = this._toRGB(this.color, alpha - alpha * (i / size));
            context.stroke();

            context.arc(this._circle.x, this._circle.y, this._circle.radius + i, 0, Math.PI * 2, false);
            context.lineWidth = this._circle.thickness;
            context.strokeStyle = this._toRGB(this.color, alpha - alpha * (i / size));
            context.stroke();
        }

        context.closePath();
    }

    _toRGB(array, alpha) {
        return "rgba(" + array[0] + "," + array[1] + "," + array[2] + "," + alpha + ")";
    }
}

Circle.Proptypes = {
    radius: React.PropTypes.number.isRequired,
    color: React.PropTypes.array.isRequired,
    padding: React.PropTypes.number
};