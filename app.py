from flask import Flask, render_template, send_from_directory
from forms import TestForm
import json
import random
import pandas as pd
import numpy as np
import scipy.sparse as sparse
from scipy.sparse.linalg import spsolve
import implicit
import math

app = Flask(__name__)
app.config['SECRET_KEY'] = '4da3ad463de4a2b60095e5b0'

global new_dictionary_miscellaneous
global model
global data_df
global sparse_user_item

#GET TOP TEN
#returns json of top ten movies
#in form of [{"name": "thename", "related": ["civ6", "civ5", "civ4"]}]
@app.route('/games', methods=['GET'])
def topten():
    print("here")
    ids = range(10)
    games = {k: new_dictionary_miscellaneous[k] for k in ids}
    output = []
    for id, game_info in games.items():

        related = list(model.similar_items(id, 4))
        related = [str(id) for id, similarity in related[1:]]

        desired_info = {
            "id": id,
            "name": game_info[0],
            "related": related
        }

        output.append(desired_info)
    print(output)
    return json.dumps(output)

@app.route('/title/<_id>', methods=['GET'])
def title(_id):
    game_info = new_dictionary_miscellaneous[int(_id)]
    output = {"id": _id, "name": game_info[0]}

    return json.dumps(output)

@app.route('/rankings/<id_string>')
def rankings(id_string):
    ids = id_string.split('_')
    r = get_recommendations_new_user_feedback(data_df=data_df, feedback_array=ids)
    dg = get_different_genre_rank(r, new_dictionary_miscellaneous)
    recommended_ids = [str(item[0]) for item in dg]
    return json.dumps(recommended_ids)

@app.route('/info/<_id>')
def info(_id):
    game_info = new_dictionary_miscellaneous[int(_id)]
    output = {
        "id": _id,
        "name": game_info[0],
        "steamlink": game_info[1],
        "genre": game_info[2],
        "description": game_info[3]
    }

    return json.dumps(output)


@app.route('/', methods=['GET', 'POST'])
def index():
    return send_from_directory("./client/build", "index.html")
#     return render_template('index.html', form=TestForm())



@app.route('/<path:filename>')
def static_build(filename):
    return send_from_directory("./client/build", filename)

@app.route('/static/js/<path:filename>')
def static_js(filename):
    return send_from_directory("./client/build/static/js", filename)

@app.route('/static/css/<path:filename>')
def static_css(filename):
    return send_from_directory("./client/build/static/css", filename)

# Placeholder for model training code
# new_dictionary_miscellaneous = {
#     0: ('Fallout 4', 'http://link.com', 'RPG', '29.99'),
#     1: ('GTA 5', 'http://link.com', 'RPG', '29.99'),
#     2: ('Civ 6', 'http://link.com', 'RPG', '29.99'),
#     3: ('Call of Duty: World at War', 'http://link.com', 'RPG', '29.99'),
#     4: ('Madden 21', 'http://link.com', 'RPG', '29.99'),
#     5: ('GTA 4', 'http://link.com', 'RPG', '29.99'),
#     6: ('Civ 5', 'http://link.com', 'RPG', '29.99'),
#     7: ('NBA 2k21', 'http://link.com', 'RPG', '29.99'),
#     8: ('Call of Duty: Warzone', 'http://link.com', 'RPG', '29.99'),
#     9: ('Red Dead Redemption 2', 'http://link.com', 'RPG', '29.99'),
# }


if __name__ == '__main__':
    #from sklearn.preprocessing import MinMaxScaler
    data_df1 = pd.read_csv("Datasets/steam_games.csv")
    data_df1 = data_df1.rename(columns={"name": "GameID"})
    #print(data_df1.head())
    #data_df1 = data_df1.loc[(data_df1.GameID == data_df1.GameID)]

    # get rid of nan values
    data_df1 = data_df1[data_df1["GameID"].notna()]
    data_df1 = data_df1[["url","GameID","popular_tags","genre","game_description","original_price"]][["url","GameID","popular_tags","genre","game_description","original_price"]]
    unique_GameID1 = data_df1['GameID'].unique()
    #unique_GameID1 = unique_GameID1.loc[()]
    data_df2 = pd.read_csv("Datasets/steam-200k.csv", sep=',', names=["UserID", "GameID", "Action", "Behavior","Extra"])
    unique_GameID2 = data_df2['GameID'].unique()

    data_df1['GameID'] = data_df1['GameID'].astype(str)
    data_df2['GameID'] = data_df2['GameID'].astype(str)

    #data_df = pd.read_csv("./steam-200k.csv", sep=',', names=["UserID", "GameID", "Action", "Behavior","Extra"])
    data_df = pd.merge(data_df2, data_df1, on='GameID')


    # getting rid of purchased but not played games
    data_df = data_df.loc[(data_df.Action == "play")]

    # First, generate dictionaries for mapping old id to new id for users and games
    unique_GameID = data_df['GameID'].unique()
    unique_UserID = data_df['UserID'].unique()
    j = 0
    user_old2new_id_dict = dict()
    for u in unique_UserID:
        user_old2new_id_dict[u] = j #map old id to new id
        j += 1
    j = 0
    game_old2new_id_dict = dict()
    for i in unique_GameID:
        game_old2new_id_dict[i] = j #map game_name to numeric id
        j += 1

    # to hold data of interest associated to each game
    new_dictionary_miscellaneous = {}
    for key in game_old2new_id_dict:
        current_id = game_old2new_id_dict[key]
        #tmp_row = data_df1.loc[data_df1['GameID'] == key]
        tmp_row = data_df1.loc[data_df1['GameID'] == key].iloc[0]
        tmp_url = tmp_row['url']
        tmp_genre = tmp_row['genre']
        tmp_game_description = tmp_row['game_description']
        tmp_price = tmp_row['original_price']
        new_dictionary_miscellaneous[current_id] = (key,tmp_url,tmp_genre,tmp_game_description,tmp_price)

    # Then, use the generated dictionaries to reindex UserID and GameID in the data_df
    user_list = data_df['UserID'].values
    game_list = data_df['GameID'].values
    #print(data_df.head())
    for j in range(len(data_df)):
        user_list[j] = user_old2new_id_dict[user_list[j]]
        game_list[j] = game_old2new_id_dict[game_list[j]]
    data_df['UserID'] = user_list
    data_df['GameID'] = game_list
    #print(data_df.head())

    # generate train_df with 70% samples and test_df with 30% samples, and there should have no overlap between them.
    train_index = np.random.random(len(data_df)) <= 0.7
    train_df = data_df[train_index]
    test_df = data_df[~train_index]

    # generate train_mat and test_mat
    num_user = len(data_df['UserID'].unique())
    num_game = len(data_df['GameID'].unique())

    train_mat = sparse.coo_matrix((train_df['Behavior'].values, (train_df['UserID'].values, train_df['GameID'].values)), shape=(num_user, num_game)).astype(float)
    test_mat = sparse.coo_matrix((test_df['Behavior'].values, (test_df['UserID'].values, test_df['GameID'].values)), shape=(num_user, num_game)).astype(float).toarray()
    train_mat = (train_mat > 0).astype(float)

    # Create a numeric user_id and artist_id column
    data_df['UserID'] = data_df['UserID'].astype("category").cat.codes
    data_df['GameID'] = data_df['GameID'].astype("category").cat.codes


    # The implicit library expects data as a item-user matrix so we
    # create two matricies, one for fitting the model (item-user)
    # and one for recommendations (user-item)
    sparse_item_user = sparse.csr_matrix((train_df['Behavior'].values, (train_df['GameID'].values, train_df['UserID'].values)), shape=(num_game,num_user)).astype(float)
    sparse_user_item = sparse.csr_matrix((train_df['Behavior'].values, (train_df['UserID'].values, train_df['GameID'].values)), shape=(num_user, num_game)).astype(float)

    # Initialize the als model and fit it using the sparse item-user matrix
    model = implicit.bpr.BayesianPersonalizedRanking(factors=63,learning_rate = 0.01 ,regularization=0.001, iterations=20)
    #model = implicit.als.AlternatingLeastSquares(factors=20, regularization=0.1, iterations=20)

    # Calculate the confidence by multiplying it by our alpha value.
    alpha_val = 15
    data_conf = (sparse_item_user * alpha_val).astype('double')

    data_conf = (sparse_item_user)

    #Fit the model
    model.fit(data_conf)

    # Provide item id and number of wanted items
    # game_old2new_id_dict maps from title to GameID. i.e., {'Fallout 4': 0 ....
    item_id = 0
    n_similar = 70
    similar = model.similar_items(item_id, n_similar)

    # Provide user id and number of wanted items
    user_id = 0
    n_similar = 50
    recommended = model.recommend(user_id, sparse_user_item,n_similar)

    def get_different_genre_rank(recommended,new_dictionary_miscellaneous):
        overall_freq = {}
        for pair in recommended:
            game = pair[0]
            genre_arr = []
            if not isinstance(new_dictionary_miscellaneous[game][2], float):
                genre_arr = new_dictionary_miscellaneous[game][2].split(",")
            for current_genre in genre_arr:
                if current_genre not in overall_freq:
                    overall_freq[current_genre] = 1
                else:
                    overall_freq[current_genre] += 1
        #print(overall_freq)
        new_rec = []
        for pair in recommended:
            game = pair[0]
            rank = pair[1]
            genre_arr = []
            if not isinstance(new_dictionary_miscellaneous[game][2], float):
                genre_arr = new_dictionary_miscellaneous[game][2].split(",")
            for current_genre in genre_arr:
                rank = rank * math.log10(50/overall_freq[current_genre])
            new_rec.append((game,rank))
        # sort games from lower to highest ranking
        new_rec.sort(key=lambda x:x[1])

        # reverse array
        new_rec = list(reversed(new_rec))
        return new_rec

    new_games = get_different_genre_rank(recommended,new_dictionary_miscellaneous)

    for game,rank in new_games:
        name = new_dictionary_miscellaneous[game][0]
        url = new_dictionary_miscellaneous[game][1]
        genre = new_dictionary_miscellaneous[game][2]
        description = new_dictionary_miscellaneous[game][3]
        price = new_dictionary_miscellaneous[game][4]
        #print(name,url,genre,price,description)

    def get_recommendations_new_user_feedback(data_df,feedback_array):
        new_id = data_df['UserID'].unique()[-1] + 1
        for game in feedback_array:
            tmp_df = pd.DataFrame([[new_id, game, 1]], columns=["UserID","GameID","Behavior"])
            data_df = data_df.append(tmp_df, ignore_index=True)
        # First, generate dictionaries for mapping old id to new id for users and games
        unique_GameID = data_df['GameID'].unique()
        unique_UserID = data_df['UserID'].unique()
        j = 0
        user_old2new_id_dict = dict()
        for u in unique_UserID:
            user_old2new_id_dict[u] = j #map old id to new id
            j += 1
        j = 0
        game_old2new_id_dict = dict()
        for i in unique_GameID:
            game_old2new_id_dict[i] = j #map game_name to numeric id
            j += 1

        # Then, use the generated dictionaries to reindex UserID and GameID in the data_df
        user_list = data_df['UserID'].values
        game_list = data_df['GameID'].values
        #print(data_df.head())
        for j in range(len(data_df)):
            user_list[j] = user_old2new_id_dict[user_list[j]]
            game_list[j] = game_old2new_id_dict[game_list[j]]
        data_df['UserID'] = user_list
        data_df['GameID'] = game_list
        #print(data_df.head())

        # generate train_df with 70% samples and test_df with 30% samples, and there should have no overlap between them.
        #train_index = np.random.random(len(data_df)) <= 0.7
        #train_df = data_df[train_index]
        train_df = data_df
        #test_df = data_df[~train_index]

        # generate train_mat and test_mat
        num_user = len(data_df['UserID'].unique())
        num_game = len(data_df['GameID'].unique())

        train_mat = sparse.coo_matrix((train_df['Behavior'].values, (train_df['UserID'].values, train_df['GameID'].values)), shape=(num_user, num_game)).astype(float)

        train_mat = (train_mat > 0).astype(float)

        # Create a numeric user_id and artist_id column
        data_df['UserID'] = data_df['UserID'].astype("category").cat.codes
        data_df['GameID'] = data_df['GameID'].astype("category").cat.codes


        # The implicit library expects data as a item-user matrix so we
        # create two matricies, one for fitting the model (item-user)
        # and one for recommendations (user-item)
        sparse_item_user = sparse.csr_matrix((train_df['Behavior'].values, (train_df['GameID'].values, train_df['UserID'].values)), shape=(num_game,num_user)).astype(float)
        sparse_user_item = sparse.csr_matrix((train_df['Behavior'].values, (train_df['UserID'].values, train_df['GameID'].values)), shape=(num_user, num_game)).astype(float)

        # Initialize the bpr model and fit it using the sparse item-user matrix
        model = implicit.bpr.BayesianPersonalizedRanking(factors=63,learning_rate = 0.01 ,regularization=0.001, iterations=20)
        #model = implicit.als.AlternatingLeastSquares(factors=20, regularization=0.1, iterations=20)

        # Calculate the confidence by multiplying it by our alpha value.
        alpha_val = 15
        data_conf = (sparse_item_user * alpha_val).astype('double')

        data_conf = (sparse_item_user)

        #Fit the model
        model.fit(data_conf)

        # Provide item id and number of wanted items
        # game_old2new_id_dict maps from title to GameID. i.e., {'Fallout 4': 0 ....
        user_id = new_id
        n_similar = 70
        recommended = model.recommend(user_id, sparse_user_item,n_similar)
        new_games = get_different_genre_rank(recommended,new_dictionary_miscellaneous)

        return(new_games)


    app.run(threaded=True, port=5000)
