import os
import spacy

from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import func
from flask_marshmallow import Marshmallow
from gensim.corpora import Dictionary
from gensim.models import LdaModel

# Init app
app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'database', 'YInt.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

v1 = Blueprint('v1', __name__, url_prefix='/api/v1')

# Init db
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    account = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(100), nullable=False)

    def __init__(self, time, location, account, original_message):
        self.time = time
        self.location = location
        self.account = account
        self.message = original_message

    def __repr__(self):
        return '<Message %r>' % self.id

class MessageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'time', 'location', 'account', 'message')

message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

# NLP
nlp = spacy.load('en_core_web_sm')
# Update spaCy's default stopwords list
stop_words = ["'s", "m", "u", "o", "s"]
nlp.Defaults.stop_words.update(stop_words)


@v1.route('/messages', methods=['GET'])
def get_messages():
    """
    Get all messages or all messages between a specified date range.
    """
    start_date = request.args.get('start', default=None, type=str)
    end_date = request.args.get('end', default=None, type=str)

    if start_date and end_date:
        all_messages = Message.query.filter(
            Message.time.between(start_date, end_date)
            ).all()
    else:
        all_messages = Message.query.all()

    result = messages_schema.dump(all_messages)

    return jsonify(result)

@v1.route('/locations', methods=['GET'])
def get_locations():
    """
    Get all messages or all messages between a specified date range.
    """
    start_date = request.args.get('start', default=None, type=str)
    end_date = request.args.get('end', default=None, type=str)

    if start_date and end_date:
        all_messages = db.session.query(Message.location, func.count(Message.id).label('id')).filter( Message.time.between(start_date, end_date)).group_by(Message.location).all()

    else:
        all_messages = db.session.query(Message.location, func.count(Message.id).label('id')).group_by(Message.location).all()

    result = messages_schema.dump(all_messages)

    return jsonify(result)

@v1.route('/timeline', methods=['GET'])
def get_timeline():
    """
    Get all messages or all messages between a specified date range.
    """
    start_date = request.args.get('start', default=None, type=str)
    end_date = request.args.get('end', default=None, type=str)
    time_period  = func.strftime('%Y-%m-%d %H:%M', Message.time)

    if start_date and end_date:
        all_messages = db.session.query(time_period.label('time'), func.count(Message.id).label('numberOfMessages')).filter( Message.time.between(start_date, end_date)).group_by(time_period).all()

    else:
        all_messages = db.session.query(time_period.label('time'), func.count(Message.id).label('numberOfMessages')).group_by(time_period).all()

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
            Message.time.between(start_date, end_date),Message.is_repost == False).all()
    else:
        messages = Message.query.filter(
            Message.is_repost == False).all()

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
    try:
        num_topics = int(params.get('num_topics')[0])
    except:
        num_topics = 10
    try:
        start_date = params['start'][0]
        end_date = params['end'][0]
    except KeyError:
        start_date = None
        end_date = None
    topics = {}

    # TODO: Implement topic classification
    # if 'labels' in params.keys():
    #     labels = params['labels'][0].split(',')

    if start_date and end_date:
        messages = Message.query.filter(
            Message.time.between(start_date, end_date),Message.is_repost == False).all()
    else:
        messages = Message.query.filter(Message.is_repost == False).all()

    doc = []
    for message in messages:
        if message.message:
            words = nlp(message.message.lower())
            text = []
            for word in words:
                if not word.is_stop and not word.is_punct and not word.is_space and not word.is_digit:
                    text.append(word.lemma_)
            doc.append(text)

    dictionary = Dictionary(doc)
    corpus = [dictionary.doc2bow(text) for text in doc]
    lda = LdaModel(corpus=corpus, id2word=dictionary, num_topics=num_topics)

    topics = (lda.print_topics(num_topics=num_topics))

    return jsonify(topics)


# Register version
app.register_blueprint(v1)

# Run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
