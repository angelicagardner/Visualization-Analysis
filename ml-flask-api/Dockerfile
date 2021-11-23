FROM python:3.8-slim-buster

WORKDIR /app

COPY ml-flask-api/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]