#!/bin/bash
file="$1"
if [ -f "$file" ]
then
	echo "true"
else
	echo "false"
fi