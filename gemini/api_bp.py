# myapp/api/routes.py
from flask import Blueprint, request, jsonify
import json
import sqlite3
from myapp import utils # <-- Import utils here

api_bp = Blueprint('api', __name__, url_prefix='/api')

#Combined crud op call route to invoke any of the
#utility crud functions
@api_bp.route("/crud/operation", methods=['POST'])
def crudOperation():
    # ... your existing code here ...
    data = request.json
    # ... etc.
    params = json.loads(data)
    opcode = params['opcode']
    operations_map = {
        "create": utils.create,
        "read": utils.read,
        "update": utils.update,
        "delete": utils.delete,
    }

    # Get the function reference from the map
    crud_function_to_call = operations_map.get(opcode)
    
    if crud_function_to_call:
        # Call the function through the variable
        try:
            result = crud_function_to_call(params) # Assuming your utils function takes the parsed params
            # ... your serialization logic ...
            if isinstance(result, sqlite3.Row):
                data_to_serialize = dict(result)
            elif isinstance(result, list):
                data_to_serialize = [dict(row) for row in result]
            elif isinstance(result, str):
                data_to_serialize = result
            elif isinstance(result, int):
                data_to_serialize = result
            else:
                return jsonify({"Error": f"Unexpected data type from utility function: {type(result)}"}), 500
            
            return jsonify(data_to_serialize), 200
        except Exception as e:
            # Handle potential errors from the utility function
            return jsonify({"Error": str(e)}), 500
            
    return jsonify({"Error": "Invalid opcode"}), 400