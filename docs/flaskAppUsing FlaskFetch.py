"""
 Examples of Using flaskFetch with Flask Routes
Let's assume you have a Flask application running on http://127.0.0.1:5000.

Flask Backend Example

"""

from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- GET Request Example ---
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Data retrieved successfully!", "items": ["item1", "item2", "item3"]})

# --- POST Request Example ---
@app.route('/api/submit', methods=['POST'])
def submit_data():
    if request.is_json:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        print(f"Received data: Name={name}, Email={email}") # For server-side logging
        return jsonify({"message": "Data received!", "your_data": {"name": name, "email": email}}), 201
    return jsonify({"error": "Request must be JSON"}), 400

# --- PUT Request Example ---
@app.route('/api/update/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    if request.is_json:
        data = request.get_json()
        new_value = data.get('value')
        # In a real app, you'd update a database record here
        print(f"Updating item {item_id} with value: {new_value}")
        return jsonify({"message": f"Item {item_id} updated successfully to '{new_value}'"}), 200
    return jsonify({"error": "Request must be JSON"}), 400

# --- DELETE Request Example ---
@app.route('/api/delete/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    # In a real app, you'd delete a database record here
    print(f"Deleting item {item_id}")
    return jsonify({"message": f"Item {item_id} deleted successfully"}), 204 # 204 No Content for successful deletion with no body

# --- Error Handling Example ---
@app.route('/api/error', methods=['GET'])
def trigger_error():
    return jsonify({"message": "Something went wrong on the server!"}), 500