import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { checkCookie } from "api";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "store";
import App from "./App";
import "./i18n";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn: "https://c4342140cbb846cab56a06581c7a1a9a@o574517.ingest.sentry.io/6012095",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: `velthyding@${process.env.npm_package_version}`,
});
checkCookie();

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
