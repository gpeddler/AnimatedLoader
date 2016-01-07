import React from 'react';
import ReactDOM from 'react-dom';
import Loader from './components/loader.js';

let colors = [
    [40, 235, 169],
    [67, 205, 245]
];

ReactDOM.render(<Loader speed={ 3 } text="FNIXA" colors={ colors } />, document.getElementById("wrap"));