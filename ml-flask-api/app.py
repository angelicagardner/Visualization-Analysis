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
v2 = Blueprint('v2', __name__, url_prefix='/api/v2')

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

@v2.route('/messages', methods=['GET'])
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

    for object in result:
        object['cluster_keywords'] = [object['cluster_keyword1'], object['cluster_keyword2'], 
                                        object['cluster_keyword3'], object['cluster_keyword4']]
        del object['cluster_keyword1']
        del object['cluster_keyword2']
        del object['cluster_keyword3']
        del object['cluster_keyword4']
        if object['word1'] == None and object['word2'] == None:
            object['words'] = []

        elif object['word1'] == None:
            object['words'] = [{"name": object['word2'], "weight": object['weight2']}]
        elif object['word2'] == None:
            object['words'] = [{"name": object['word1'], "weight": object['weight1']}]
        else:
            object['words'] = [{"name": object['word1'], "weight": object['weight1']}, 
                                {"name": object['word2'], "weight": object['weight2']}]
        del object['word1']
        del object['weight1']
        del object['word2']
        del object['weight2']

    return jsonify(result)

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
app.register_blueprint(v2)

# Run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
