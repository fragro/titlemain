#!/bin/bash
mv epm.json epm.json.backup
key1_addr=$(cat ~/.eris/chains/simplechain/addresses.csv | grep simplechain_full_000 | cut -d ',' -f 1)
eris pkgs do --chain simplechain --address $key1_addr --compiler https://compilers.monax.io:10114
