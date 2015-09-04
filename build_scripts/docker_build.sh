#!/usr/bin/env bash

cd builds/cayle/volos-redis-manager-cli
npm install && \
cat <<EOF > test/demo/config/default.yaml
  redis-port: $REDIS_PORT_6379_TCP_PORT
  redis-host: redis
  redis-db: 2
  apiEncryptionKey: abcdefg123456
EOF
cd -