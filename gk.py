from flask import Flask, render_template
from flask import request, jsonify

app = Flask(__name__)

import sqlite3 

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect("spillmeny.db")

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create table for Doke game high scores
cursor.execute('''
CREATE TABLE IF NOT EXISTS doke_save (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Highscore INTEGER NOT NULL
)
''')

# Create table for Pizza Clicker game scores
cursor.execute("""
CREATE TABLE IF NOT EXISTS pizza_save (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score VARCHAR(255) NOT NULL
)
""")

cursor.execute('''
INSERT INTO pizza_save(score)
VALUES (?)
''', ("0"))  # Default score of 0
# cursor.execute('''
#                SELECT score FROM pizza_save WHERE id=%s''', 
#                (id))

@app.route('/get_score', methods=['GET'])
def get_score():
    try:
        # Connect to the database
        conn = sqlite3.connect("spillmeny.db")
        cursor = conn.cursor()

        # Fetch the latest score (highest ID)
        cursor.execute('SELECT score FROM pizza_save ORDER BY id DESC LIMIT 1')
        row = cursor.fetchone()

        # Close the connection
        conn.close()

        # Return the fetched score or a default score if no records exist
        if row:
            score = row[0]
            return jsonify({"score": score}), 200
        else:
            return jsonify({"score": 0}), 200
    except Exception as e:
        # Handle any errors
        return jsonify({"error": str(e)}), 500


@app.route('/save_clicks', methods=['POST'])
def save_clicks():
    # Get the number of clicks from the request
    data = request.get_json()
    score = data.get('score')

    if score is None:
        return jsonify({"error": "Invalid data"}), 400

    # Save to the database
    try:
        conn = sqlite3.connect("spillmeny.db")
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO pizza_save(score)
        VALUES (?)
        ''', (score,))
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Commit changes and close connection
conn.commit()
conn.close()


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