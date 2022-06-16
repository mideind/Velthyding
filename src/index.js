import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { checkCookie } from "api";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "store";
import App from "./App";
import "./features/i18n";

const isDevelopment = process.env.NODE_ENV === "development";

Sentry.init({
  dsn: "https://c4342140cbb846cab56a06581c7a1a9a@o574517.ingest.sentry.io/6012095",
  integrations: [new Integrations.BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.6,
  environment: process.env.NODE_ENV,
  release: `velthyding@${process.env.npm_package_version}`,
  beforeSend: (event) => {
    if (isDevelopment) {
      return null;
    }
    return event;
  },
});
checkCookie();
function FallbackComponent({ _error, _componentStack, resetError }) {
  const { t } = useTranslation();
  return (
    <div className="App-body">
      <h2>{t("Oops!")}</h2>
      <p>{t("Something, somewhere went terribly wrong.")}</p>
      <p>{t("Please reload the page.")}</p>
      <button type="button" onClick={resetError}>
        {t("Reload")}
      </button>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={null}>
        <React.StrictMode>
          <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Sentry.ErrorBoundary>
        </React.StrictMode>
      </Suspense>
    </PersistGate>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
