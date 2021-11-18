import os
import sys
import inspect
import numpy as np
import pandas as pd

from pathlib import Path
from sklearn.feature_extraction import text
from sklearn.feature_extraction.text import TfidfVectorizer

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0, parentdir) 

from lib.gsdmm.mgp import MovieGroupProcess
from app import Message

current_path = Path('.').resolve()
df = pd.read_csv(current_path / 'ml-flask-api' / 'database' / 'stop_words.csv', header=0, index_col=False)
stop_words = text.ENGLISH_STOP_WORDS.union(df.columns.tolist())


def remove_stopwords(original):
    words = original.lower().split()
    filtered_words = [w for w in words if w not in stop_words]

    original_nostop = ' '.join(filtered_words)

    return original_nostop


def get_tfidf_weights(messages): 
    tfidfvectorizer = TfidfVectorizer(analyzer='word', stop_words=stop_words)
    tfidf = tfidfvectorizer.fit_transform(messages)
    tfidf_tokens = tfidfvectorizer.get_feature_names()

    df_tfidfvect = pd.DataFrame(data = tfidf.toarray(), columns = tfidf_tokens)

    return df_tfidfvect


"""
"""
def load_data_into_DB(db, file_name):
    data = pd.read_csv(current_path / 'data' / file_name)

    messages = data['message'].apply(lambda x: np.str_(x)).tolist()
    # tfidf_matrix = get_tfidf_weights(messages)

    docs = []
    for message in messages:
        if 're: ' in message:
            continue
        doc = remove_stopwords(str(message).replace('.', '').replace('!', '').replace('?', '').replace('-', '') \
            .replace(':', '').replace(',', '').replace('#', '') \
            .replace("('", '').replace("')", '').replace('("', '') .replace('")', ''))
        doc = doc.split(' ')
        if "" in doc:
            doc.remove("")
        docs.append(doc)
    n_terms = len(set(x for doc in docs for x in doc))

    mgp = MovieGroupProcess(K=8, alpha=0.1, beta=0.1, n_iters=150)
    clusters = mgp.fit(docs, n_terms)

    doc_count = np.array(mgp.cluster_doc_count)
    print('\nNumber of documents per topic :', doc_count)

    top_index = doc_count.argsort()[-15:][::-1]
    print('Most important clusters (by number of docs inside):', top_index)

    # for index, row in data.iterrows():
    # #   try:
    #     print(index)
    #     print(row['time'], row['location'], row['account'], row['message'])
        #print(mgp.choose_best_label(str(row['message'])))
    #         message = Message(row['time'], row['location'], row['account'], row['message'])
    #         for word, weight in tfidf_matrix.iteritems():
    #             if weight[0] > 0.0:
    #                 tag = Tag(word, weight[0])
    #                 message.tags.append(tag)
    #                 db.session.add(tag)
    #         db.session.add(message)
    #         db.session.commit()
    #   except Exception as e:
    #       db.session.rollback()
    #       print(e)
    #   finally:
    #       db.session.close()

    topics = dict()
    for cluster in top_index:
        sort_dicts =sorted(mgp.cluster_word_distribution[cluster].items(), key=lambda k: k[1], reverse=True)[:4]
        print('Cluster %s : %s'%(cluster,sort_dicts))
        print('-'*120)
        topics['Cluster ' + str(cluster)] = sort_dicts

load_data_into_DB(None, 'YInt.csv')