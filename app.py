from flask import Flask, render_template
from forms import TestForm
import json
app = Flask(__name__)
app.config['SECRET_KEY'] = '4da3ad463de4a2b60095e5b0'

global new_dictionary_miscellaneous

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html', form=TestForm())


#GET TOP TEN
#returns json of top ten movies
#in form of [{"name": "thename", "related": ["civ6", "civ5", "civ4"]}]
@app.route('/games', methods=['GET'])
def topten():
    ids = range(10)
    games = {k: new_dictionary_miscellaneous[k] for k in ids}
    output = []
    for id, game_info in games.items():
        desired_info = {
            "name": game_info[0],
            "related": []
        }
        output.append(desired_info)
    return json.dumps(output)

@app.route('/title/<_id>', methods=['GET'])
def title(_id):
    game_info = new_dictionary_miscellaneous[int(_id)]
    output = {"id": _id, "name": game_info[0]}

    return json.dumps(output)


# Placeholder for model training code
new_dictionary_miscellaneous = {
    0: ('Fallout 4', 'http://link.com', 'RPG', '29.99'),
    1: ('GTA 5', 'http://link.com', 'RPG', '29.99'),
    2: ('Civ 6', 'http://link.com', 'RPG', '29.99'),
    3: ('Call of Duty: World at War', 'http://link.com', 'RPG', '29.99'),
    4: ('Madden 21', 'http://link.com', 'RPG', '29.99'),
    5: ('GTA 4', 'http://link.com', 'RPG', '29.99'),
    6: ('Civ 5', 'http://link.com', 'RPG', '29.99'),
    7: ('NBA 2k21', 'http://link.com', 'RPG', '29.99'),
    8: ('Call of Duty: Warzone', 'http://link.com', 'RPG', '29.99'),
    9: ('Red Dead Redemption 2', 'http://link.com', 'RPG', '29.99'),
}

if __name__ == '__main__':
    app.run(threaded=True, port=5000)
