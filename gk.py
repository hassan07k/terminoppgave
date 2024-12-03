from flask import Flask, render_template

app = Flask(__name__)




@app.route('/home')
def root():
    return render_template("index.htm")



@app.route('/doke')
def doke():
    return render_template("doke.htm")

@app.route('/pizzaclicker')
def pizzaClicker():
    return render_template("pizzaclicker.htm")



if __name__ == '__main__':
    app.run(debug=True)