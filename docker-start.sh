#!/usr/bin/env bash
echo "Removing old container if there is one..."
docker rm -f smu-arcade-machine;
docker-compose up -d;