import React from 'react';
import ReactDOM from 'react-dom';

import Circle from './circle.js';
import Dot from './dot.js';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.radius = parseInt(props.radius);
        this.color = [
            [40, 235, 169],
            [67, 205, 245]
        ];
    }

    render() {
        return (
            <div className="loader">
                <Circle radius={ this.radius } padding={ 30 } color={ [67, 205, 245] } />
                <Dot radius={ this.radius } padding={ 30 } color={ [40, 235, 169] } />
            </div>
        );
    }
}

Loader.Proptypes = {
    radius: React.PropTypes.string.isRequired
};