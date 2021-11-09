from pathlib import Path
import pandas as pd
from app import Message


def load_data_into_DB(db, file_name):
    current_path = Path('.').resolve()
    data = pd.read_csv(current_path / '..' / 'data' / file_name)

    for index, row in data.iterrows():
        try:
            print(index)
            db.session.add(Message(row['time'], row['location'], row['account'], row['message']))
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        finally:
            db.session.close()