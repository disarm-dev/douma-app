# Deployment

Uses `Caddy` server with git hooks.

1. Need repo (Bitbucket) to have the right webhooks.
2. Start caddy server


## Uploading sourcemaps 

This is useful for error tracking in Sentry.

If not already installed via `package.json`, will need to install the `sentry-cli` with:

```
npm install sentry-cli-binary
```

Then authenticate with
```
./node_modules/.bin/sentry-cli login
``` 

Press 'n' to not open a browser, and enter the token from "Accounts > API" on Sentry.io (is bottom-left of the screen)
