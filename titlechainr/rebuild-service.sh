#!/usr/bin/sh
docker build -t titlechainr .
eris services rm --force titlechainr
eris services start titlechainr
eris services start ipfs
