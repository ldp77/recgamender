from flask import Flask, render_template
from forms import TestForm
app = Flask(__name__)
app.config['SECRET_KEY'] = '4da3ad463de4a2b60095e5b0'

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html', form=TestForm())


#GET TOP TEN
#returns json of top ten movies
#in form of [{"name": "thename", "related": ["civ6", "civ5", "civ4"]}]
@app.route('/movies/topten.json', methods=['GET'])
def topten():
    pass



if __name__ == '__main__':
    app.run(threaded=True, port=5000)
