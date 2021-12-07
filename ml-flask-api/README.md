# Run ML API

```bash
$ docker build -t ml-flask-api .
```

```bash
$ docker run -p 5000:5000 -d ml-flask-api
```

# Use another Dataset

The dataset should be contained in a CSV file with the following columns:

> "time","location","account","message"

This bootup process takes around 10 minutes to complete.

1. Move the .CSV file containing the data to the `data` directory located in the root folder of this project.

2. Then run the following command in the terminal:

```bash
python run.py --dataset_file=YInt.csv
```

But replace **YInt.csv** with the name of the dataset file you want to use.
