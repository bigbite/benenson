#!/usr/bin/env sh

# escape a version number for sed
_v() {
    echo $(echo "$1" | tr -d '\n' | sed 's/\./\\\./g');
}

# cross-compatible sed in-place
_sedi() {
    sed --version > /dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@";
}

_bump() {
    local bumptype="${1:-patch}"
    local oldversion;
    local newversion;

    # retrieve old version
    oldversion=$(cat "$PWD/gulp/tasks/styles.js" | grep '^\tVersion: ' | awk '{print $2}');

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
