#!/usr/bin/env sh

nvm use 10

composer global require \
  dealerdirect/phpcodesniffer-composer-installer:0.5.0 \
  wp-coding-standards/wpcs:1.2.1 \
  automattic/vipwpcs:0.4.0 \
  && yarn lint
