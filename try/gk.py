from flask import Flask

app = Flask(__name__)




@app.route('/')
def root():
    return '<h1> heihei</h1>'

@app.route('/annen')
def annen():
    return '<h1> byebye!</h1>'



if __name__ == '__main__':
    app.run(debug=True)