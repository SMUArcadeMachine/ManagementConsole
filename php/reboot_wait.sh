#!/bin/sh
PID=pidof Mame
while : ; do
        [ ! -d /proc/$PID ] && break
        sleep 1
done
shutdown -r now
