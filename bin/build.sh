#!/usr/bin/env sh

nvm use 10

yarn \
&& yarn build \
&& yarn lang \
&& zip -r ../benenson.zip . \
  -x .\* \
  -x bin/\* \
  -x gulp/\* \
  -x gulpfile.js \
  -x node_modules/\* \
  -x package.json \
  -x phpcs.xml \
  -x src/\* \
  -x webpack.config.js \
  -x yarn.lock
