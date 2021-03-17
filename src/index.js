import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './App';
import { store } from 'store.js';
import * as serviceWorker from './serviceWorker';

import './i18n';

import { checkCookie } from 'api';
checkCookie();


ReactDOM.render(
    <Provider store={store}>
        <Suspense fallback={null}>
            <App />
        </Suspense>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
