#!/usr/bin/env sh

composer global require \
  dealerdirect/phpcodesniffer-composer-installer:0.7.2 \
  wp-coding-standards/wpcs:2.3.0 \
  automattic/vipwpcs:2.3.0 \
  && yarn lint
