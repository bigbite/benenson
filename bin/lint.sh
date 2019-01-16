#!/usr/bin/env sh
composer global require \
  dealerdirect/phpcodesniffer-composer-installer:0.5.0 \
  wp-coding-standards/wpcs:1.2.1 \
  automattic/vipwpcs:0.4.0 \
  && yarn lint
