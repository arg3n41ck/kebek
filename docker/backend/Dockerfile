FROM python:3.9
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED=1
# Setup GDAL
RUN apt-get update

RUN apt-get install -y libgdal-dev g++ --no-install-recommends && \
    pip install whitenoise && \
    apt-get clean -y


WORKDIR /app
ADD ./backend/requirements.txt /app/backend/
RUN pip install --upgrade pip
RUN pip install -r /app/backend/requirements.txt
ADD ./docker /app/docker
ADD ./backend /app/backend
RUN ["chmod", "+x", "/app/docker/backend/wsgi-entrypoint.sh"]
EXPOSE 8000
