#!/bin/bash
for pdfile in *.pdf ; do
  pdftoppm -rx 300 -ry 300 -png "${pdfile}" "${pdfile%.*}"
done

for pngfiles in *.png ; do
  tesseract "${pngfiles}" "${pngfiles}".out
done