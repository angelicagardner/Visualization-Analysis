FROM python:3.8-slim-buster

WORKDIR /app

COPY ml-flask-api/requirements.txt ./
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get autoremove -y \
    && apt-get install -y \
    gcc \
    build-essential \
    zlib1g-dev \
    wget \
    unzip \
    cmake \
    python3-dev \
    gfortran \
    libblas-dev \
    liblapack-dev \
    libatlas-base-dev \
    && apt-get clean
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY /ml-flask-api /app

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]