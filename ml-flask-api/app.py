import os
from flask import Flask, Blueprint, request, jsonify
from datetimerange import DateTimeRange

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

v1 = Blueprint('v1', __name__, url_prefix='/api/v1')


@v1.route('/messages', methods=['GET'])
def get_messages():
    """
    Get all messages or all messages between a specified date range.
    """
    start_date = request.args.get('start', default=None, type=str)
    end_date = request.args.get('end', default=None, type=str)

    if start_date and end_date:
        datetime_range = DateTimeRange(start_date, end_date)

    messages = {0: {'time': '2020-04-06 00:00:00', 'location': 'Weston', 'account': 'Opportunities2', 'message': 'Take advantheeseage of theesehese One, theeserembling sales!'},
                1: {'time': '2020-04-06 00:00:00', 'location': 'Southton', 'account': 'LazyBCouch', 'message': "@WatchesThomasBird fork it you're back in he someneomething he someneomeone mieten und behinderte they die or he Timberlake #MakesItyoureCan"}}

    return jsonify(messages)


@v1.route('/bow', methods=['GET'])
def get_bow():
    """
    Get a Bag-of-Words representation of all messages or all messages between a specified date range.
    """
    start_date = request.args.get('start', default=None, type=str)
    end_date = request.args.get('end', default=None, type=str)

    # check that start and end was provided
    if start_date and end_date:
        datetime_range = DateTimeRange(start_date, end_date)

    bow = {'help': 12, 'water': 10, 'food': 8, 'money': 7, 'love': 6,
           'family': 5, 'friends': 4, 'fun': 3, 'work': 2, 'school': 1}

    return jsonify(bow)


@v1.route('/topics', methods=['GET'])
def get_topics():
    """
    Count words in messages and group them by similar word patterns to infer topics.

    All messages are used or only messages between a specified date range.

    If predefined labels for topics are provided, messages will be classified into the most likely topic.
    """
    params = request.args.to_dict(flat=False)

    if params:
        if params['start'] and params['end']:
            datetime_range = DateTimeRange(
                params['start'][0], params['end'][0])

        if 'labels' in params.keys():
            labels = params['labels'][0].split(',')

    topics = {}

    return jsonify(topics)


# Register version
app.register_blueprint(v1)

# Run server
if __name__ == "__main__":
    app.run(debug=True)
