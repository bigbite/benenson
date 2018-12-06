#!/usr/bin/env sh

yarn && yarn build && zip -r ../benenson.zip . \
    -x .\* \
    -x CODE_OF_CONDUCT.md \
    -x ISSUE_TEMPLATE.md \
    -x bin/\* \
    -x gulp/\* \
    -x gulpfile.js \
    -x node_modules/\* \
    -x package.json \
    -x phpcs.xml \
    -x pull_request_template.md \
    -x src/\* \
    -x webpack.config.js \
    -x yarn.lock
