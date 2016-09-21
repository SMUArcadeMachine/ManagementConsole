#!/usr/bin/env bash
echo "Re/building images and re/creating containers..."
docker-compose up -d --build --force-recreate;