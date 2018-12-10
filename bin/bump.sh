#!/usr/bin/env sh

# escape a version number for sed
v() {
    echo $(cat "$1" | tr -d '\n' | sed 's/\./\\\./g')
}

# X-compatible sed in-place
sedi() {
    sed --version > /dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

# set old version & bump new version
cat .versionnew > .versionold
cat .versionold | awk -F. '/[0-9]+\./{$NF+=1;OFS=".";print}' > .versionnew

# find/replace old/new versions in required files
sedi "s/$(v .versionold)/$(v .versionnew)/g" gulp/tasks/styles.js
sedi "s/$(v .versionold)/$(v .versionnew)/g" includes/scripts-and-styles.php
