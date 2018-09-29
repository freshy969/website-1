import fs from "fs";
import path from "path";

import React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import express from "express";
import Backend from "i18next-node-fs-backend";
import i18nextMiddleware from "i18next-express-middleware";
import Helmet from "react-helmet";
// import { minify } from "html-minifier";

import i18n from "./i18n/i18n";
import Routes from "./routes";
import SystemDetectorProvider from "./components/SystemDetector/Provider";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp("src");
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
// const minifierConfig = {
//   removeAttributesQuotes: false,
//   removeComments: true,
//   minifyJS: true,
//   minifyCSS: true,
//   sortAttributes: true,
//   sortClassName: true
// };

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      preload: ["en", "fr"],
      backend: {
        loadPath: `${appSrc}/i18n/{{lng}}/{{ns}}.json`,
        addPath: `${appSrc}/i18n/{{lng}}/{{ns}}.missing.json`
      }
    },
    () => {
      server
        .disable("x-powered-by")
        .use(i18nextMiddleware.handle(i18n))
        .use("/locales", express.static(`${appSrc}/i18n`))
        .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
        .use(express.static("/app/build/public")) // Fix static path on Heroku.
        .get("/*", (req, res) => {
          const context = {};
          const Root = () => (
            <SystemDetectorProvider ua={req.headers["user-agent"]}>
              <I18nextProvider i18n={req.i18n}>
                <StaticRouter context={context} location={req.url}>
                  <Routes />
                </StaticRouter>
              </I18nextProvider>
            </SystemDetectorProvider>
          );

          const markup = renderToString(<Root />);
          const staticMarkup = renderToStaticMarkup(<Root />);
          const helmet = Helmet.renderStatic();

          if (context.url) {
            res.redirect(context.url);
          } else {
            const initialI18nStore = {};
            req.i18n.languages.forEach(l => {
              initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
            });

            const initialLanguage = req.i18n.language;

            res.status(200).send(
              `<!doctype html>
    <html lang="">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${helmet.meta.toString()}
      ${helmet.title.toString()}
      ${helmet.link.toString()}
      <link rel="manifest" href="/manifest.json">
      <link rel="shortcut icon" href="/favicon.ico">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Fredoka+One">
      <style>body,html{margin:0;padding:0;font-family:Roboto, sans-serif}*{box-sizing:border-box;text-rendering:optimizelegibility}#root{height:100%;width:100%}</style>
      ${
        assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ""
      }
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${markup}</div>
      <script>
        window.initialI18nStore = JSON.parse(\`${JSON.stringify(
          initialI18nStore
        )}\`);
        window.initialLanguage = '${initialLanguage}';
      </script>
      ${
        process.env.NODE_ENV === "production"
          ? `<script src="${assets.client.js}" defer></script>`
          : `<script src="${assets.client.js}" defer crossorigin></script>`
      }
    </body>
</html>`
            );
          }
        });
    }
  );

export default server;
