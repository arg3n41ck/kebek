#!/bin/sh

do
    echo "Waiting for server volume..."
done

until ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

./manage.py collectstatic --noinput &&
./manage.py compilemessages &&

until cd /app/backend

gunicorn kebek.wsgi --bind 0.0.0.0:8000 --workers 2 --threads 2
