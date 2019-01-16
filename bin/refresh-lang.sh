#!/usr/bin/env sh

# cross-compatible sed in-place
_sedi() {
  isGnu=$(sed --version > /dev/null 2>&1)

  if [ "$isGnu" ]; then
    sed -i -- "$@"
  else
    sed -i "" "$@";
  fi
}

# remove changes that only touch refresh header and do nothing else:
remove_date_only_changes() {
  if ! git ls-files "$1" --error-unmatch >/dev/null 2>&1; then
    return
  fi

  changes=$(git diff "$1" | grep '^[+-][^+-]' | grep -vc '\(PO-Revision\|POT-Creation\)-Date')

  if [ "$changes" -eq 0 ]; then
    git checkout "$1"
  fi
}

# scrap rubbish from gettext-generated file
fixup_header_information() {
  thedate=$(date '+%Y-%m-%d %H:%M%z')

  # replace placeholder information
  _sedi "s/FULL NAME <EMAIL@ADDRESS>//g" "$1"
  _sedi "s/LANGUAGE <LL@li.org>//g" "$1"
  _sedi "s/YEAR-MO-DA HO:MI+ZONE/$thedate/g" "$1"

  # trim the fat
  _sedi -e '1,4d' "$1"
}

# add headers required for usage in poedit
insert_poedit_headers() {
  # create temporary empty file for poedit headers
  touch ./languages/header.txt
  truncate -s 0 ./languages/header.txt

  # insert poedit headers
  echo '"X-Generator: Poedit 2.2.1\\n"' >> ./languages/header.txt
  echo '"X-Poedit-Basepath: ..\\n"' >> ./languages/header.txt
  echo '"X-Poedit-Flags-xgettext: --add-comments=translators:\\n"' >> ./languages/header.txt
  echo '"X-Poedit-WPHeader: style.css\\n"' >> ./languages/header.txt
  echo '"X-Poedit-SourceCharset: UTF-8\\n"' >> ./languages/header.txt
  echo '"X-Poedit-KeywordsList: __;_e;_n:1,2;_x:1,2c;_ex:1,2c;_nx:4c,1,2;esc_attr__;"' >> ./languages/header.txt
  echo '"esc_attr_e;esc_attr_x:1,2c;esc_html__;esc_html_e;esc_html_x:1,2c;_n_noop:1,2;"' >> ./languages/header.txt
  echo '"_nx_noop:3c,1,2;__ngettext_noop:1,2\\n"' >> ./languages/header.txt
  echo '"PO-Revision-Date: \\n"' >> ./languages/header.txt
  echo '"X-Poedit-SearchPath-0: .\\n"' >> ./languages/header.txt
  echo '"X-Poedit-SearchPathExcluded-0: *.js\\n"' >> ./languages/header.txt

  # backup POT file
  mv "$1" "$1.bak"
  # insert headers from backup POT file into new POT file
  sed -e '/^$/,$d' "$1.bak" > "$1"
  # append poedit headers to new POT file
  cat ./languages/header.txt >> "$1"
  # append everything after the headers in backup POT file into new POT file
  sed -e '1,14d' "$1.bak" >> "$1"

  # cleanup
  rm ./languages/header.txt
  rm "$1.bak"
}

touch ./languages/_benenson.pot

# pass all found PHP files to gettext
find . -name "*.php" | grep -vi '^\.\/\.git' | xargs xgettext \
  --language=PHP \
  --output=./languages/_benenson.pot \
  --force-po \
  --add-location=full \
  --from-code=UTF-8 \
  --foreign-user \
  --copyright-holder='' \
  --add-comments=translators \
  --package-name=Benenson \
  --msgid-bugs-address=https://github.com/bigbitecreative/benenson/issues \
  -k_ \
  -kgettext \
  -kdgettext:2 \
  -kdcgettext:2 \
  -kngettext:1,2 \
  -kdngettext:2,3 \
  -kdcngettext:2,3 \
  -k__ \
  -k_e \
  -k_n:1,2 \
  -k_x:1,2c \
  -k_ex:1,2c \
  -k_nx:4c,1,2 \
  -kesc_attr__ \
  -kesc_attr_e \
  -kesc_attr_x:1,2c \
  -kesc_html__ \
  -kesc_html_e \
  -kesc_html_x:1,2c \
  -k_n_noop:1,2 \
  -k_nx_noop:3c,1,2 \
  -k__ngettext_noop:1,2

# cleanup temporary POT file
fixup_header_information ./languages/_benenson.pot
insert_poedit_headers ./languages/_benenson.pot

# copy to actual POT file
msgcat -o ./languages/benenson.pot ./languages/_benenson.pot
rm ./languages/_benenson.pot

# if only the timestamp has changed, don't bother with it
remove_date_only_changes ./languages/benenson.pot

# Merge changes with PO files:
for p in ./languages/*.po; do
  msgmerge --quiet -o "$p.tmp" --no-fuzzy-matching "$p" ./languages/benenson.pot
  msgattrib --no-obsolete -o "$p" "$p.tmp"
  rm "$p.tmp"
  remove_date_only_changes "$p"
done

# validate and compile MO files:
for i in ./languages/*.po ; do
  msgfmt "$i" -c -o "${i%.*}.mo"
done
