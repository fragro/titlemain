#!/usr/bin/sh
sh ./rebuild-service.sh
sleep 1
curl -is http://localhost:8082/test
sleep 2
eris services logs titlechainr