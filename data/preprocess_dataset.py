from pathlib import Path
import pandas as pd

current_path = Path('.').resolve()

df = pd.read_csv(current_path / 'data' / 'YInt.csv')

# Message as it was originally saved
df.rename(columns={'message': 'original_message'}, inplace=True)
# Message without hashtags, mentions of other users, and repost tag
df.insert(loc=4, column='message', value='')
# Hashtags retrieved from the message
df.insert(loc=5, column='hashtag', value='')
# Mentions retrieved from the message
df.insert(loc=6, column='mention', value='')
# True or False (1 or 0) if the message is a repost of another message, i.e. includes the re: tag
df.insert(loc=7, column='is_repost', value=0)
# Integer representing the number of times the message was reposted, i.e. this is the original message
df.insert(loc=8, column='number_reposts', value=0)

for index, row in df.iterrows():
    message = row['original_message']

    # Retrieve hashtags
    if '#' in (str(row['original_message'])):
        tags = row['original_message'].split('#')
        if len(tags) > 2:
            tag = ''
            for i in range(1, len(tags)):
                if tags[i].split(' ') != '':
                    tag += '#' + tags[i].split(' ')[0] + ' '
                    message = message.replace(
                        ('#' + tags[i].split(' ')[0]), '')
        else:
            tag = '#' + row['original_message'].split('#')[1].split(' ')[0]
            message = message.replace(tag, '')
        df.at[index, 'hashtag'] = tag

    # Retrieve mentions of other users
    if '@' in (str(row['original_message'])):
        mentions = row['original_message'].split('@')
        if len(mentions) > 2:
            mention = ''
            for i in range(1, len(mentions)):
                if mentions[i].split(' ') != '':
                    mention += '@' + mentions[i].split(' ')[0] + ' '
                    message = message.replace(
                        ('@' + mentions[i].split(' ')[0]), '')
        else:
            mention = '@' + row['original_message'].split('@')[1].split(' ')[0]
            message = message.replace(mention, '')
        df.at[index, 'mention'] = mention

    # Retrieve number of reposts
    for j in range(len(df)):
        if index == j:
            continue
        # Row should contain original messages and replies should contain "re: "
        if ('re: ' in str(df.at[j, 'original_message']) and (df.at[j, 'original_message'].replace('re: ', '') == row['original_message'])) and not ('re: ' in str(row['original_message'])):
            df.at[index, 'number_reposts'] = df.at[index, 'number_reposts'] + 1

    # Check if message is a repost
    if 're: ' in str(row['original_message']):
        df.at[index, 'is_repost'] = 1

    # Save message (without hashtag, mention, and repost tag)
    message = str(message).replace('re: ', '')
    df.at[index, 'message'] = message

df.to_csv(current_path / 'data' / 'YInt_preprocessed.csv', index=False)
