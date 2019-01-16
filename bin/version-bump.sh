#!/usr/bin/env sh

# ./bin/bump.sh [<version>]
#   <version> The version release version to increment.
#     default: patch
#     options: major|minor|patch
#
# Increments the package version by 1 across the following files:
# - /gulp/tasks/styles.js
# - /includes/scripts-and-styles.php
#
# EXAMPLE USAGE:
#   ./bin/bump.sh minor

# escape a version number for sed
_v() {
  echo "$(echo "$1" | tr -d '\n' | sed 's/\./\\\./g')";
}

# cross-compatible sed in-place
_sedi() {
  isGnu=$(sed --version > /dev/null 2>&1)
  if [ "$isGnu" ]; then
    sed -i -- "$@"
  else
    sed -i "" "$@";
  fi
}

_bump() {
  bumptype="${1:-patch}"

  # retrieve old version
  oldversion=$(grep '^\tVersion: ' "$PWD/gulp/tasks/styles.js" | awk '{print $2}');

  # bump it
  case "$bumptype" in
    major) newversion=$(echo "$oldversion" | awk '{split($NF,v,/[.]/); $NF=++v[1]"."v[2]"."v[3]}1');;
    minor) newversion=$(echo "$oldversion" | awk '{split($NF,v,/[.]/); $NF=v[1]"."++v[2]"."v[3]}1');;
    patch) newversion=$(echo "$oldversion" | awk '{split($NF,v,/[.]/); $NF=v[1]"."v[2]"."++v[3]}1');;
    *)     newversion=$(echo "$oldversion" | awk '{split($NF,v,/[.]/); $NF=v[1]"."v[2]"."++v[3]}1');;
  esac

  # escape versions for use in sed
  oldversion=$(_v "$oldversion")
  newversion=$(_v "$newversion")

  # find/replace old/new versions in required files
  _sedi "s/$oldversion/$newversion/g" "$PWD/gulp/tasks/styles.js";
  _sedi "s/$oldversion/$newversion/g" "$PWD/includes/scripts-and-styles.php";
}

_bump "$1"
