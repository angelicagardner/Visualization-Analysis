import os
from flask import Flask, Blueprint, request, jsonify
from datetimerange import DateTimeRange
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'YInt.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

v1 = Blueprint('v1', __name__, url_prefix='/api/v1')

# Init db
db = SQLAlchemy(app)
ma = Marshmallow(app)


class Message(db.Model):
    # Message Class/Model
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    account = db.Column(db.String(100), nullable=False)
    original_message = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(100), nullable=False)
    hashtag = db.Column(db.String(100))
    mention = db.Column(db.String(100))
    is_repost = db.Column(db.Boolean, nullable=False)
    number_of_reposts = db.Column(db.Integer, nullable=False)

    def __init__(self, time, location, account, original_message, message, hashtag, repost, mention, is_repost, number_of_reposts):
        self.time = time
        self.location = location
        self.account = account
        self.original_message = original_message
        self.message = message
        self.hashtag = hashtag
        self.mention = mention
        self.is_repost = is_repost
        self.number_of_reposts = number_of_reposts


class MessageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'time', 'location', 'account', 'original_message',
                  'message', 'hashtag', 'mention', 'is_repost', 'number_of_reposts')


message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)


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

    #all_messages = Message.query.all()
    #result = messages_schema.dump(all_messages)
    # return jsonify(result.data)

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
