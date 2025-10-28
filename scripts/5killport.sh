#!/bin/bash

# Find and kill processes running on ports 12001 and 12000
echo "Killing processes on ports 12001 and 12000..."

# Kill process on port 12001
PID_12001=$(sudo lsof -ti:12001)
if [ ! -z "$PID_12001" ]; then
    sudo kill -9 $PID_12001
    echo "Killed process $PID_12001 on port 12001"
else
    echo "No process found on port 12001"
fi

PID_12001=$(sudo lsof -ti:12001)
if [ ! -z "$PID_12001" ]; then
    sudo kill -9 $PID_12001
    echo "Killed process $PID_12001 on port 12001"
else
    echo "No process found on port 12001"
fi

# Kill process on port 12000
PID_12000=$(sudo lsof -ti:12000)
if [ ! -z "$PID_12000" ]; then
    sudo kill -9 $PID_12000
    echo "Killed process $PID_12000 on port 12000"
else
    echo "No process found on port 12000"
fi


PID_12000=$(sudo lsof -ti:12000)
if [ ! -z "$PID_12000" ]; then
    sudo kill -9 $PID_12000
    echo "Killed process $PID_12000 on port 12000"
else
    echo "No process found on port 12000"
fi

echo "Done!"