from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = '10.2.2.202'
app.config['MYSQL_USER'] = 'xxlendoxx1'
app.config['MYSQL_PASSWORD'] = 'lendo001'
app.config['MYSQL_DB'] = 'spillmeny_db'
app.config['MYSQL_PORT'] = 3306  # Default MySQL/MariaDB port
mysql = MySQL(app)

# Helper function: Create tables for the application
def create_tables():
    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Create table for Doke game high scores
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS doke_save (
            id INT AUTO_INCREMENT PRIMARY KEY,
            highscore INT NOT NULL
        )
        """)

        # Create table for Pizza Clicker scores
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS pizza_save (
            id INT AUTO_INCREMENT PRIMARY KEY,
            score INT NOT NULL
        )
        """)

        conn.commit()  # Commit the changes
        cursor.close()  # Close the cursor
        print("Tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")

# Initialize tables when the server starts
with app.app_context():
    create_tables()

# Save Pizza Clicker score
@app.route('/save_pizza', methods=['POST'])
def save_pizza():
    data = request.get_json()
    score = data.get('score')  # Get the score from JSON payload

    if score is None:
        return jsonify({"error": "Invalid data"}), 400

    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Save the score to the database
        cursor.execute('INSERT INTO pizza_save (score) VALUES (%s)', (score,))
        conn.commit()
        cursor.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get the latest Pizza Clicker score
@app.route('/get_score', methods=['GET'])
def get_score():
    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Fetch the most recent score
        cursor.execute('SELECT score FROM pizza_save ORDER BY id DESC LIMIT 1')
        row = cursor.fetchone()
        cursor.close()

        if row:
            return jsonify({"score": row[0]}), 200
        else:
            return jsonify({"score": 0}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Save Doke high score
@app.route('/save_doke', methods=['POST'])
def save_doke():
    data = request.get_json()
    score = data.get('Highscore')

    if score is None:
        return jsonify({"error": "Invalid data"}), 400

    try:
        conn = mysql.connection
        cursor = conn.cursor()

        # Save only if the new score is higher than the current high score
        cursor.execute('SELECT MAX(highscore) FROM doke_save')
        current_highscore = cursor.fetchone()[0] or 0

        if int(score) > int(current_highscore):
            c
