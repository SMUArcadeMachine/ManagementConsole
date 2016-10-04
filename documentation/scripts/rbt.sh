#!/bin/bash

# Wait for the mame process to be dead
PID=`pgrep mame`
echo "Waiting for process ID $PID to end..."
while ps axg | grep -vw grep | grep -w $PID > /dev/null; do sleep 1; done

echo "Rebooting Machine"
sleep 5; shutdown -r +0 # shutdown --reboot in +0 minutes (+1 minute by default)