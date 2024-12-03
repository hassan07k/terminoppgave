from flask import Flask, render_template

app = Flask(__name__)




@app.route('/home')
def root():
    return render_template("index.htm")



@app.route('/doke_game')
def doke():
    return render_template("doke.htm")

@app.route('/pizza')
def annen2():
    return '<h1> fuck you!</h1>'



if __name__ == '__main__':
    app.run(debug=True)