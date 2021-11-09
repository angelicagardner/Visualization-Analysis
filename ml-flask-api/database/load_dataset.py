import numpy as np
import pandas as pd

from pathlib import Path
from sklearn.feature_extraction import text
from sklearn.feature_extraction.text import TfidfVectorizer

from app import Message, Tag

current_path = Path('.').resolve()

def get_tfidf_weights(messages):

    stop_words = text.ENGLISH_STOP_WORDS.union(pd.read_csv(current_path / 'database' / 'stop_words.csv', header=None))

    tfidfvectorizer = TfidfVectorizer(analyzer='word', stop_words=stop_words)
    tfidf = tfidfvectorizer.fit_transform(messages)
    tfidf_tokens = tfidfvectorizer.get_feature_names()

    df_tfidfvect = pd.DataFrame(data = tfidf.toarray(), columns = tfidf_tokens)

    return df_tfidfvect


def load_data_into_DB(db, file_name):
    data = pd.read_csv(current_path / '..' / 'data' / file_name)
    messages = data['message'].apply(lambda x: np.str_(x)).tolist()

    tfidf_matrix = get_tfidf_weights(messages)

    for index, row in data.iterrows():
        try:
            print(index)
            message = Message(row['time'], row['location'], row['account'], row['message'])
            for word, weight in tfidf_matrix.iteritems():
                if weight[0] > 0.0:
                    tag = Tag(word, weight[0])
                    message.tags.append(tag)
                    db.session.add(tag)
            db.session.add(message)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        finally:
            db.session.close()
