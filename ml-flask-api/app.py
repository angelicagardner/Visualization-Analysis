import os

from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.functions import func
from flask_marshmallow import Marshmallow

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

# Message model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    account = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(100), nullable=False)
    cluster = db.Column(db.Integer, nullable=False)
    cluster_keyword1 = db.Column(db.String(100), nullable=False)
    cluster_keyword2 = db.Column(db.String(100), nullable=False)
    cluster_keyword3 = db.Column(db.String(100), nullable=False)
    cluster_keyword4 = db.Column(db.String(100), nullable=False)
    word1 = db.Column(db.String(100))
    weight1 = db.Column(db.Float)
    word2 = db.Column(db.String(100))
    weight2 = db.Column(db.Float)
    

    def __init__(self, time, location, account, message, 
                cluster, cluster_keyword1, cluster_keyword2, cluster_keyword3, cluster_keyword4, 
                word1, weight1, word2, weight2):
        self.time = time
        self.location = location
        self.account = account
        self.message = message
        self.cluster = cluster
        self.cluster_keyword1 = cluster_keyword1
        self.cluster_keyword2 = cluster_keyword2
        self.cluster_keyword3 = cluster_keyword3
        self.cluster_keyword4 = cluster_keyword4
        self.word1 = word1
        self.weight1 = weight1
        self.word2 = word2
        self.weight2 = weight2

    def __repr__(self):
        return '<Message %r>' % self.id

class MessageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'time', 'location', 'account', 'message', 
        'cluster', 'cluster_keyword1', 'cluster_keyword2', 'cluster_keyword3', 'cluster_keyword4', 
        'word1', 'weight1', 'word2', 'weight2')

message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

# Tf-Idf Model
class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=False)

    def __init__(self, word, weight):
        self.word = word
        self.weight = weight

    def __repr__(self):
        return '<Tag %r>' % self.id

class TagSchema(ma.Schema):
    class Meta:
        fields = ('word', 'weight')

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)

"""
    Endpoint: /messages
    Get all Messages or all Messages between a specified date range.
    Returns data in JSON format.
"""
@v1.route('/messages', methods=['GET'])
def get_messages():
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


# Register version
app.register_blueprint(v1)

# Run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
