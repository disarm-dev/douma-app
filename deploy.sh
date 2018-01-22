#!/usr/bin/env bash

for pid in $(pgrep -f node); do
  echo "Killed node process $pid"
  kill -KILL -$pid
done

# Do the actual building and zero-downtime deployment
git fetch --tags
npm install --no-shrinkwrap --no-package-lock
time npm run build #> build.log 2>&1
rm -rf serve/
mv dist/ serve/

# Get some variales
VERSION=$(git describe)

# Upload sourceMaps to sentry.io
SOURCEMAP_FILES=(./serve/static/js/*.map)
./node_modules/.bin/sentry-cli releases -o disarm -p douma files $VERSION upload-sourcemaps ${SOURCEMAP_FILES[@]}
echo "Uploaded sourcemaps"


# Send a useful message back via a Slack webhook
message=$(git rev-parse --abbrev-ref HEAD)": "
message=$message" "$VERSION
message=$message"    [commit: "$(git log --oneline -n 1)"]"
echo "Built $message"

echo $message | tr -d \'\" | xargs -I % curl -X "POST" "https://hooks.slack.com/services/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" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "text": "'%'"
}'
