#!/usr/bin/env bash
# Yayın kapısı: testler geçmezse göndermez; gönderdikten sonra GitHub Pages yayınının bittiğini doğrular.
# Kullanım: tests/yayin.sh   (değişiklikler önceden commit edilmiş olmalı)
set -euo pipefail
cd "$(dirname "$0")/.."
REPO="teypblt-cmyk/personel-cizelge"
echo "== Testler =="
node tests/run.js
if [ -n "$(git status --porcelain)" ]; then echo "Commit edilmemiş değişiklik var, önce commit et."; exit 1; fi
echo "== Gönderiliyor =="
git push origin main
H=$(git rev-parse --short=7 HEAD)
echo "== Yayın bekleniyor ($H) =="
for i in $(seq 1 24); do
  r=$(gh run list -R "$REPO" -w "pages-build-deployment" -L 1 --json status,conclusion,headSha -q '.[0]|.headSha[0:7]+" "+.status+" "+(.conclusion//"")' 2>/dev/null || true)
  case "$r" in
    "$H completed success") echo "Yayında: $H"; exit 0;;
    "$H completed "*) echo "Yayın BAŞARISIZ: $r"; exit 1;;
  esac
  sleep 15
done
echo "Yayın 6 dakikada başlamadı ya da bitmedi; elle kontrol et."; exit 1
