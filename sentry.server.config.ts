import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://ebcf8b0da3a3dbc657ba80c591149895@o4509322735845376.ingest.us.sentry.io/4509322739056640',

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
