#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect Static Files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Seed initial database data
python manage.py seed_questions
python manage.py seed_courses
