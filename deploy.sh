#!/bin/bash

# PythonAnywhere Auto-Deployment Script
# This script is triggered by the webhook endpoint in app.py

set -e  # Exit on any error

# Configuration
PROJECT_DIR="/home/timstaxonomy/mysite"
VENV_DIR="$HOME/.virtualenvs/timstaxonomy"
LOG_FILE="$HOME/deployment.log"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========== Starting Deployment =========="

# Navigate to project directory
cd "$PROJECT_DIR" || { log "ERROR: Project directory not found"; exit 1; }
log "Changed to project directory: $PROJECT_DIR"

# Pull latest code from GitHub
log "Pulling latest code from GitHub..."
git pull origin main || { log "ERROR: Git pull failed"; exit 1; }
log "Successfully pulled latest code"

# Activate virtual environment
log "Activating virtual environment..."
source "$VENV_DIR/bin/activate" || { log "ERROR: Failed to activate virtual environment"; exit 1; }
log "Virtual environment activated"

# Update dependencies
log "Installing/updating dependencies..."
pip install -r requirements.txt --quiet || { log "ERROR: Failed to install dependencies"; exit 1; }
log "Dependencies updated successfully"

# Find and touch WSGI file to reload the app
# PythonAnywhere WSGI file is typically at /var/www/<username>_pythonanywhere_com_wsgi.py
WSGI_FILE="/var/www/timstaxonomy_pythonanywhere_com_wsgi.py"

if [ -f "$WSGI_FILE" ]; then
    log "Touching WSGI file to reload app: $WSGI_FILE"
    touch "$WSGI_FILE"
    log "App reloaded successfully"
else
    log "WARNING: WSGI file not found at $WSGI_FILE"
    log "Please manually reload your web app from the PythonAnywhere dashboard"
fi

log "========== Deployment Completed Successfully =========="
log ""

exit 0
