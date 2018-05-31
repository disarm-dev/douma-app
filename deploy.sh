#!/usr/bin/env bash

# Get tags to start with
git fetch --tags


# Return early if on master, but not exact tag
BRANCH=$(git rev-parse --abbrev-ref HEAD)
BRANCH_REGEX="^master"

TAG=$(git describe --exact-match)
TAG_REGEX='^v'

if [[ $BRANCH =~ $BRANCH_REGEX ]] && [[ ! $TAG =~ $TAG_REGEX ]]
  then echo "Not deploying - on master without version tag"; exit 0
  else echo "Either on master with version tag, or on other branch"
fi


for pid in $(pgrep -f node); do
  echo "Killed node process $pid"
  kill -KILL -$pid
done

# Do the actual building and zero-downtime deployment
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


# Send a useful message back via a webhook
message=$(git rev-parse --abbrev-ref HEAD)
message=$message" "$VERSION
message=$message"@"$(git log --oneline -n 1)
echo "Built $message"

echo $message | tr -d \'\" | xargs -I % curl -X "POST" "https://hooks.zapier.com/hooks/catch/138741/fz7fdi/" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "text": "'%'"
}'
