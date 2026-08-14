#!/bin/sh
# exit on error
set -o errexit

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Applying database migrations..."
python manage.py migrate

echo "Seeding initial questionnaire database..."
python manage.py seed_questions

echo "Seeding career courses database..."
python manage.py seed_courses

echo "Starting server..."
exec "$@"
