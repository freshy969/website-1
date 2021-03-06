import React from "react";
import BrowserRouter from "react-router-dom/BrowserRouter";
import { hydrate, render } from "react-dom";
import { I18nextProvider } from "react-i18next";

import Routes from "./routes";
import i18n from "./i18n/i18n";
import SystemDetectorProvider from "./components/SystemDetector/Provider";

import registerServiceWorker from "./registerServiceWorker"
import "./index.css"

const rootNode = document.getElementById("root");
const renderOrHydrate = rootNode.innerHTML.trim().length ? hydrate : render;

i18n.init({
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  addPath: '/locales/add/{{lng}}/{{ns}}',
  allowMultiLoading: true,
  crossDomain: false,
  withCredentials: false,
});

renderOrHydrate(
  <SystemDetectorProvider ua={window.navigator.userAgent}>
    <I18nextProvider
      i18n={i18n}
      initialI18nStore={
        typeof window !== "undefined" && window.initialI18nStore
      }
      initialLanguage={typeof window !== "undefined" && window.initialLanguage}
    >
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </I18nextProvider>
  </SystemDetectorProvider>,
  rootNode
);
registerServiceWorker();

if (module.hot) {
  i18n.init({
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/add/{{lng}}/{{ns}}',
    allowMultiLoading: true,
    crossDomain: false,
    withCredentials: false,
  });

  module.hot.accept();
}
