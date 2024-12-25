import * as Sentry from '@sentry/browser';

import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: "https://12256af2ff88ce90c0765c1978b893db@o4508465731796992.ingest.de.sentry.io/4508465743593552",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

// function greet() {
//   console.log('Hello, world!');
// }


function causeError() {
  throw new Error('This is a test error');
}

causeError();