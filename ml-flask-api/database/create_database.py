import os
import sys
import inspect
import numpy as np
import pandas as pd

from pathlib import Path
from sklearn.feature_extraction import text
from sklearn.feature_extraction.text import TfidfVectorizer

import warnings
warnings.filterwarnings("ignore")

currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0, parentdir) 

from lib.gsdmm.mgp import MovieGroupProcess
from app import Message

current_path = Path('.').resolve()
df = pd.read_csv(current_path / 'database' / 'stop_words.csv', header=0, index_col=False)
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
Creates the database and loads the data into it after performing TF-IDF and Topic Modeling.
"""
def load_data_into_DB(db, file_name):
    db.create_all()
    data = pd.read_csv(current_path.parent / 'data' / file_name)
    messages = data['message'].apply(lambda x: np.str_(x)).tolist()
    full_text = [''.join(x for x in messages)]

    tfidf_matrix = get_tfidf_weights(full_text)

    docs = []
    for message in messages:
        doc = remove_stopwords(str(message).replace('.', '').replace('!', '').replace('?', '').replace('-', '') \
            .replace(':', '').replace(',', '').replace('#', '') \
            .replace("('", '').replace("')", '').replace('("', '') .replace('")', ''))
        doc = doc.split(' ')
        if "" in doc:
            doc.remove("")
        docs.append(doc)
    n_terms = len(set(x for doc in docs for x in doc))

    mgp = MovieGroupProcess(K=6, alpha=0.1, beta=0.1, n_iters=10)
    clusters = mgp.fit(docs, n_terms)  

    doc_count = np.array(mgp.cluster_doc_count)
    print('\nNumber of documents per topic :', doc_count)

    top_index = doc_count.argsort()[-15:][::-1]
    print('Most important clusters (by number of docs inside):', top_index)

    for index, row in data.iterrows():
        try:
            print('\n' + str(index))
            time = row['time']
            location = row['location']
            account = row['account']
            message = row['message']
            cluster = clusters[index]
            tags = sorted(mgp.cluster_word_distribution[cluster].items(), key=lambda k: k[1], reverse=True)[:4]
            tag1 = ''
            tag2 = ''
            tag3 = ''
            tag4 = ''
            for i, tag in enumerate(tags):
                if i == 0:
                    tag1 = tag[0]
                elif i == 1:
                    tag2 = tag[0]
                elif i == 2:
                    tag3 = tag[0]
                elif i == 3:
                    tag4 = tag[0]
            words = remove_stopwords(str(message).replace('.', '').replace('!', '').replace('?', '').replace('-', '') \
                .replace(':', '').replace(',', '').replace('#', '') \
                .replace("('", '').replace("')", '').replace('("', '') .replace('")', '')).split(' ')
            word1 = None
            weight1 = None
            word2 = None
            weight2 = None
            for i, word in enumerate(words):
                if word in tfidf_matrix.columns:
                    if tfidf_matrix[word][0] > 0.07 and word1 == None:
                        word1 = word
                        weight1 = tfidf_matrix[word][0]
                    elif tfidf_matrix[word][0] > 0.07 and word2 == None and word != word1:
                        word2 = word
                        weight2 = tfidf_matrix[word][0]
            message = Message(time, location, account, message, str(cluster), 
                            tag1, tag2, tag3, tag4, 
                            word1, weight1, word2, weight2)
            db.session.add(message)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        finally:
            db.session.close()

    # topics = dict()
    # for cluster in top_index:
    #     sort_dicts =sorted(mgp.cluster_word_distribution[cluster].items(), key=lambda k: k[1], reverse=True)[:4]
    #     print('Cluster %s : %s'%(cluster,sort_dicts))
    #     print('-'*120)
    #     topics['Cluster ' + str(cluster)] = sort_dicts