import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

import './index.css';

import '../src/fonts/coffee+teademo-Regular.ttf';
import '../src/fonts/coffeeteademo.woff';
import '../src/fonts/Calibri-Regular.ttf';
import '../src/fonts/Calibri-Regular.woff';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'

ReactDOM.render(  
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
