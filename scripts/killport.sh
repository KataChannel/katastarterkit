#!/bin/bash

# Find and kill processes running on ports 14000 and 13000
echo "Killing processes on ports 14000 and 13000..."

# Kill process on port 14000
PID_14000=$(sudo lsof -ti:14000)
if [ ! -z "$PID_14000" ]; then
    sudo kill -9 $PID_14000
    echo "Killed process $PID_14000 on port 14000"
else
    echo "No process found on port 14000"
fi

# Kill process on port 13000
PID_13000=$(sudo lsof -ti:13000)
if [ ! -z "$PID_13000" ]; then
    sudo kill -9 $PID_13000
    echo "Killed process $PID_13000 on port 13000"
else
    echo "No process found on port 13000"
fi

echo "Done!"