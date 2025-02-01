FROM python:3.10-slim

WORKDIR /usr/src/backend_thesis

COPY . .

RUN pip install -r requirements.txt
EXPOSE 5000
CMD python -m flask --app API run --debug --host=0.0.0.0


