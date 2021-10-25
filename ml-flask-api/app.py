import os
import spacy

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

nlp = spacy.load('en_core_web_sm')
# Update spaCy's default stopwords list
stop_words = ["'s", "m", "u", "o", "s"]
nlp.Defaults.stop_words.update(stop_words)


class Message(db.Model):
    # Message Class/Model
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    account = db.Column(db.String(100), nullable=False)
    original_message = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(100))
    hashtag = db.Column(db.String(100))
    mention = db.Column(db.String(100))
    is_repost = db.Column(db.Boolean, nullable=False)
    number_of_reposts = db.Column(db.Integer, nullable=False)

    def __init__(self, time, location, account, original_message, message, hashtag, mention, is_repost, number_of_reposts):
        self.time = time
        self.location = location
        self.account = account
        self.original_message = original_message
        self.message = message
        self.hashtag = hashtag
        self.mention = mention
        self.is_repost = is_repost
        self.number_of_reposts = number_of_reposts

    def __repr__(self):
        return '<Message %r>' % self.id


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
        all_messages = Message.query.filter(
            Message.time.between(start_date, end_date)).all()
    else:
        all_messages = Message.query.all()

    result = messages_schema.dump(all_messages)

    return jsonify(result)


@v1.route('/bow', methods=['GET'])
def get_bow():
    """
    Get a Bag-of-Words representation of all messages or all messages between a specified date range.
    """
    start_date = request.args.get('start', default=None, type=str)
    end_date = request.args.get('end', default=None, type=str)
    bow = {}

    if start_date and end_date:
        messages = Message.query.filter(
            Message.time.between(start_date, end_date)).all()
    else:
        messages = Message.query.all()

    for message in messages:
        if message.message:
            words = nlp(message.message)
            for word in words:
                if not word.is_stop and not word.is_punct and not word.is_space and not word.is_digit:
                    if word.text.lower() in bow:
                        bow[word.text.lower()] += 1
                    else:
                        bow[word.text.lower()] = 1

    bow = sorted(bow.items(), key=lambda x: x[1], reverse=True)

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
