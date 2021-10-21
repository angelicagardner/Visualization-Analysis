#!flask/bin/src
import os
import flask
import json
import logging

from time import time

from src.utils.encoder import ExtendedEncoder, returns_json

__version__ = '0.0.1'

DEBUG = os.environ.get('DEBUG', False)
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'local')
SERVICE_START_TIMESTAMP = time()

# Create Flask Application
app = flask.Flask(__name__)
# Customize Flask Application
app.logger.setLevel(logging.DEBUG if DEBUG else logging.ERROR)
app.json_encoder = ExtendedEncoder

# load saved model
app.logger.info('ENVIRONMENT: {}'.format(ENVIRONMENT))
app.logger.info('Using template version: {}'.format(__version__))


@app.route('/messages', methods=['POST'])
@returns_json
def messages():
    """Retrieve full messages and additional information about them.

    URL Params:
        daterange (string):
            The date range to retrieve messages for.
            Format: YYYY-MM-DD
    """
    # Get date range
    daterange = flask.request.args.get('daterange', None)

    before_time = time()
    try:
        # Get all messages within date range
        messages = []
    except Exception as err:
        return flask.Response(str(err), status=500)
    result = {'messages': messages}

    after_time = time()
    to_be_logged = {
        'input': flask.request.data,
        'params': flask.request.args,
        'request_id': flask.request.headers.get('X-Correlation-ID'),
        'result': result,
        'elapsed_time': after_time - before_time
    }
    app.logger.debug(to_be_logged)
    return result


@app.route('/hashtags', methods=['POST'])
@returns_json
def messages():
    """Retrieve hashtags.

    URL Params:
        daterange (string):
            The date range to retrieve messages for.
            Format: YYYY-MM-DD
    """
    # Get date range
    daterange = flask.request.args.get('daterange', None)

    try:
        # Get all hashtags within date range
        hashtags = set()
    except Exception as err:
        return flask.Response(str(err), status=500)
    else:
        return hashtags


@app.route('/bow', methods=['POST'])
@returns_json
def features():
    """Bag-of-words representation of messages.

    URL Params:
        daterange (string):
            The date range to retrieve messages for.
            Format: YYYY-MM-DD
    """
    # Get date range
    daterange = flask.request.args.get('daterange', None)

    try:
        bow = {}
    except Exception as err:
        return flask.Response(str(err), status=500)
    else:
        return bow


@app.route('/topics', methods=['POST'])
@returns_json
def preprocess():
    """Topic modelling of messages.

    URL Params:
        daterange (string):
            The date range to retrieve messages for.
            Format: YYYY-MM-DD

    """
    # Get date range
    daterange = flask.request.args.get('daterange', None)

    try:
        topics = []
    except Exception as err:
        return flask.Response(str(err), status=500)
    else:
        return topics


@app.route('/health')
def health_check():
    return flask.Response("up", status=200)


@app.route('/service-info')
@returns_json
def service_info():
    """Service information

    Get information about the service: up-time, version of the template, name
    of the served model, etc.

    """
    info = {
        'version-template': __version__,
        'running-since': SERVICE_START_TIMESTAMP,
        'debug': DEBUG
    }
    return info


if __name__ == '__main__':
    app.run(
        debug=DEBUG,
        host=os.environ.get('HOST', 'localhost'),
        port=os.environ.get('PORT', '5000'))
