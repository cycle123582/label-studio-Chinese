import * as Sentry from "@sentry/browser";
import * as ReactSentry from "@sentry/react";
import type { RouterHistory } from "@sentry/react/build/types/reactrouter";
import { Route } from "react-router-dom";
import { isDefined } from "../utils/helpers";

const SENTRY_DSN = APP_SETTINGS.sentry_dsn;
const SENTRY_ENV = APP_SETTINGS.sentry_environment ?? process.env.NODE_ENV;
const SENTRY_RATE = APP_SETTINGS.sentry_rate ? Number.parseFloat(APP_SETTINGS.sentry_rate) : 0.25;
const SENTRY_ENABLED = APP_SETTINGS.debug === false && isDefined(SENTRY_DSN);

// Production app any endpoints matching the explicit fetch will be considered for tracing
// This is to ensure we catch the API Proxy requests which will make fetch requests with a full URL without the inclusion of presign in the URL
const tracePropagationTargets = [
  // Only propagate tracing headers for same-origin paths, excluding the resolve/presign endpoints
  // Regex: ^/             => path starts with '/'
  //        (?!tasks/...   => negative lookahead excluding '/tasks/:id/(resolve|presign)'
  //           |projects/...)=> or '/projects/:id/(resolve|presign)'
  // Note: (?:...) is a non-capturing group – groups without creating numbered captures
  /^\/(?!tasks\/\d+\/(?:resolve|presign)|projects\/\d+\/(?:resolve|presign))/,
];

export const initSentry = (history: RouterHistory) => {
  if (SENTRY_ENABLED) {
    setTags();

    Sentry.init({
      dsn: APP_SETTINGS.sentry_dsn,
      tracePropagationTargets,
      integrations: [
        Sentry.browserTracingIntegration(),
        ReactSentry.reactRouterV5BrowserTracingIntegration({ history }),
      ],
      environment: SENTRY_ENV,
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: SENTRY_RATE,
      release: getVersion(),
    });
  }
};

export const captureMessage: typeof Sentry.captureMessage = (message, type) => {
  if (!SENTRY_ENABLED) {
    if (typeof type === "string" && type in console) {
      (console as any)[type](message);
    } else {
      console.log(message);
    }
    return "";
  }
  return Sentry.captureMessage(message, type);
};

export const captureException: typeof Sentry.captureException = (exception, captureContext) => {
  if (!SENTRY_ENABLED) {
    console.error(exception, captureContext);
    return "";
  }

  if (captureContext && "extra" in captureContext && captureContext.extra?.sentry_skip) {
    return "";
  }

  return Sentry.captureException(exception, captureContext);
};

const setTags = () => {
  const tags: Record<string, any> = {};

  if (APP_SETTINGS.user.email) {
    Sentry.setUser({
      email: APP_SETTINGS.user.email,
      username: APP_SETTINGS.user.username,
    });
  }

  if (APP_SETTINGS.version) {
    Object.entries(APP_SETTINGS.version).forEach(([packageName, data]: [string, any]) => {
      const { version, commit } = data ?? {};

      if (version) {
        tags[`version-${packageName}`] = version;
      }
      if (commit) {
        tags[`commit-${packageName}`] = commit;
      }
    });
  }

  Sentry.setTags(tags);
};

const getVersion = () => {
  const version = APP_SETTINGS.version?.["label-studio-os-package"]?.version;

  return version ? version : process.env.RELEASE_NAME;
};

export const SentryRoute = ReactSentry.withSentryRouting(Route);
