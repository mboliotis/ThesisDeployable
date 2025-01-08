FROM python:3-alpine

WORKDIR /usr/src/backend_thesis

COPY . .

RUN pip install Flask
RUN pip install -U flask-cors
WORKDIR /usr/src/backend_thesis
EXPOSE 5000
CMD python -m flask --app API run --debug --host=0.0.0.0


