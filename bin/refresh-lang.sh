#!/usr/bin/env sh

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

cd ./languages || exit 1

touch _benenson.pot

# pass all found PHP files to gettext
find . -name "*.php" | grep -vi '^\.\/\.git' | xargs xgettext \
  --language=PHP \
  --output=_benenson.pot \
  --force-po \
  --add-location=full \
  --from-code=UTF-8 \
  --keyword="__;_e;_n:1,2;_x:1,2c;_ex:1,2c;_nx:4c,1,2;esc_attr__;esc_attr_e;esc_attr_x:1,2c;esc_html__;esc_html_e;esc_html_x:1,2c;_n_noop:1,2;_nx_noop:3c,1,2;__ngettext_noop:1,2\n" \
  --add-comments=Translators:

# overwrite POT file
msgcat -o benenson.pot _benenson.pot
rm _benenson.pot
remove_date_only_changes benenson.pot

# Merge with PO files:
for p in *.po; do
  msgmerge --quiet -o "$p.tmp" --no-fuzzy-matching "$p" benenson.pot
  msgattrib --no-obsolete -o "$p" "$p.tmp"
  rm "$p.tmp"
  remove_date_only_changes "$p"
done

# validate and compile MO files:
for i in *.po ; do
  msgfmt "$i" -c -o "${i%.*}.mo"
done
