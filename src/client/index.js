import React from 'react';
import ReactDOM from 'react-dom';
import './config';

import App from './App';

const container = document.getElementById('app');

if (container) {
    ReactDOM.render(<App />, container);
}

module.hot.accept();