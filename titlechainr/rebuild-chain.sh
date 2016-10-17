#!/bin/sh
eris chains rm simplechain --data --dir --file --force
eris clean
eris chains make --account-types=Root:2,Full:1 simplechain
eris chains new simplechain --dir ~/.eris/chains/simplechain/simplechain_full_000
eris chains start simplechain
rm ~/.eris/apps/titlechainr/accounts.json
cp ~/.eris/chains/simplechain/accounts.json .
eris chains logs simplechain