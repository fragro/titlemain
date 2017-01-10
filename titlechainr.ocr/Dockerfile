FROM ubuntu:14.04
RUN apt-get update

RUN apt-get install -y -q build-essential python-gdal python-simplejson
RUN apt-get install -y python python-pip wget
RUN apt-get install -y python-dev
RUN pip install virtualenv
ADD . /app
RUN pip install -r /app/requirements.txt

WORKDIR /app
EXPOSE 5000

CMD [ "python", "./api.py" ]