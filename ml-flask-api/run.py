import argparse
from app import db 
from database.create_database import load_data_into_DB

parser = argparse.ArgumentParser()
parser.add_argument('--dataset_file', type=str)
args = parser.parse_args()

load_data_into_DB(db, args.dataset_file)