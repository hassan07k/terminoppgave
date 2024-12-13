from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import mariadb

app = Flask(__name__)
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = '10.2.2.202'
app.config['MYSQL_USER'] = 'xxlendoxx1'
app.config['MYSQL_PASSWORD'] = 'lendo001'
app.config['MYSQL_DB'] = 'spillmeny_db'
app.config['MYSQL_PORT'] = 3306  # Default MySQL/MariaDB port
mysql = MySQL(app)

# Create table for Doke game high scores
def create_tables():
    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Create Doke table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS doke_save (
            id INT AUTO_INCREMENT PRIMARY KEY,
            highscore INT NOT NULL
        )
        """)

        # Create Pizza Clicker table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS pizza_save (
            id INT AUTO_INCREMENT PRIMARY KEY,
            score INT NOT NULL
        )
        """)

        # Commit and close
        conn.commit()
        cursor.close()
    except Exception as e:
        print(f"Error creating tables: {e}")

# Initialize tables
create_tables()

@app.route('/save_pizza', methods=['POST'])
def save_pizza():
    data = request.get_json()
    score = data.get('score')  # Expecting the JSON payload to have a "score" key

    if score is None:
        return jsonify({"error": "Invalid data"}), 400

    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Get the current high score from the database (optional)
        cursor.execute('SELECT MAX(score) FROM pizza_save')
        row = cursor.fetchone()
        current_highscore = row[0] if row[0] is not None else 0

        # Save the new score only if it's higher (if needed) or directly save the score
        if int(score) > int(current_highscore):  # Optional condition to save only high scores
            cursor.execute('INSERT INTO pizza_save (score) VALUES (%s)', (score,))
            conn.commit()

        cursor.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Routes
@app.route('/get_score', methods=['GET'])
def get_score():
    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Fetch the latest score (highest ID)
        cursor.execute('SELECT score FROM pizza_save ORDER BY id DESC LIMIT 1')
        row = cursor.fetchone()

        # Return the fetched score or a default score if no records exist
        if row:
            score = row[0]
            return jsonify({"score": score}), 200
        else:
            return jsonify({"score": 0}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_doke', methods=['GET'])
def get_doke():
    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Fetch the highest score from the Doke table
        cursor.execute('SELECT MAX(highscore) FROM doke_save')
        row = cursor.fetchone()

        # Return the fetched high score or a default score if no records exist
        if row and row[0] is not None:
            score = row[0]
            return jsonify({"Highscore": score}), 200
        else:
            return jsonify({"Highscore": 0}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save_doke', methods=['POST'])
def save_doke():
    data = request.get_json()
    score = data.get('Highscore')

    if score is None:
        return jsonify({"error": "Invalid data"}), 400

    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Get the current high score from the database
        cursor.execute('SELECT MAX(highscore) FROM doke_save')
        row = cursor.fetchone()
        current_highscore = row[0] if row[0] is not None else 0

        # Save the new high score only if it's higher
        if int(score) > int(current_highscore):
            cursor.execute('INSERT INTO doke_save (highscore) VALUES (%s)', (score,))
            conn.commit()

        cursor.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/home')
def home():
    return render_template("index.htm")

@app.route('/doke')
def doke():
    return render_template("doke.htm")

@app.route('/pizzaclicker')
def pizza_clicker():
    return render_template("pizzaclicker.htm")

if __name__ == '__main__':
    app.run(debug=True)
