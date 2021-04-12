from flask import Flask
app = Flask(__name__)

def index():
    return '<h1>Bottom Text</h1>'

if __name__ == '__main__':
    app.run(threaded=True, port=5000)
