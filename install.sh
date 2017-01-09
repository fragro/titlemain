#!/bin/sh
curl https://install.meteor.com/ | sh 
sudo apt-get install -y python-setuptools python-dev build-essential poppler-utils tesseract-ocr
sudo easy_install pip
sudo pip install -r requirements.txt