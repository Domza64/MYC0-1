#!/bin/sh
set -e

# Fix ownership of mounted volume
chown -R appuser:appuser /app

# Drop privileges and run the main command
exec gosu appuser "$@"
