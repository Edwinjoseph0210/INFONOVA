#!/bin/bash

# Get the current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Add all changes
git add .

# Check if there are any changes to commit
if [ -n "$(git status --porcelain)" ]; then
    # Commit changes with timestamp
    git commit -m "Auto-sync: Code updated at $TIMESTAMP"
    
    # Push changes
    git push origin main
    
    echo "Changes pushed successfully at $TIMESTAMP"
else
    echo "No changes to push"
fi 