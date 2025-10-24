#!/bin/bash
set -e

export CI=true
export PNPM_HOME="/root/.pnpm"

# Load environment variables from .env.local or .env
if [ -f "/app/.env.local" ]; then
    echo "Loading environment from .env.local"
    set -a
    source /app/.env.local
    set +a
elif [ -f "/app/.env" ]; then
    echo "Loading environment from .env"
    set -a
    source /app/.env
    set +a
fi

NODE_ENV=${NODE_ENV:-development}

echo "Starting host application in $NODE_ENV mode..."

# Install dependencies
echo "Installing dependencies..."
pnpm install --prefer-frozen-lockfile || pnpm install

# Start the appropriate server
if [ "$NODE_ENV" = "production" ]; then
    echo "Building for production..."
    pnpm build
    echo "Starting Next.js production server on port 3000..."
    exec pnpm start -H 0.0.0.0
else
    echo "Starting Next.js development server on port 3000..."
    exec pnpm dev -H 0.0.0.0
fi
