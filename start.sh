#!/bin/sh

# Start Express backend in the background
echo "Starting Express backend..."
cd /app/backend
node api.js &
EXPRESS_PID=$!

# Wait a moment for Express to start
sleep 2

# Start nginx in the foreground
echo "Starting nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# Function to handle shutdown gracefully
shutdown() {
    echo "Shutting down..."
    kill $EXPRESS_PID
    kill $NGINX_PID
    exit 0
}

# Trap SIGTERM and SIGINT
trap shutdown SIGTERM SIGINT

# Wait for both processes
wait $NGINX_PID
wait $EXPRESS_PID