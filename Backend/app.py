import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import database

app = Flask(__name__)
CORS(app)  # Enables frontend requests across different ports/domains

@app.route("/")
def index():
    return "Hello World"

@app.route("/api/student", methods=['GET'])
def student():
    student_barcode = request.args.get('barcode')
    student_data = database.get_student(student_barcode)

    results = {
        "id": student_data.id,
        "name_first": student_data.name_first,
        "name_last": student_data.name_last,
        "name_official": student_data.name_official,
        "year": student_data.year,
        "photo": student_data.photo,
        # Must be a boolean (True/False) so JS resolves truthiness correctly
        "currently_out": getattr(student_data, 'currently_out', False),
        # Must be a list/array so JS can execute .map()
        "checked_out_equipment": getattr(student_data, 'checked_out_equipment', [])
    }
    return jsonify(results)

@app.route("/api/student/leave", methods=['POST'])
def sign_student_out():
    data = request.get_json() or {}
    barcode = data.get('barcode')
    destination_id = data.get('destinationId')
    reason = data.get('reason')

    now = datetime.now().strftime("%I:%M %p")

    # If destinationId or reason is passed, this is a SIGN-OUT action
    if destination_id is not None or reason is not None:
        # TODO: Update database status for student leaving
        return jsonify({
            "status": "success",
            "destination": f"Destination #{destination_id}" if destination_id else "Other",
            "time_out": now
        })

    # Otherwise, this is a SIGN-IN action
    # TODO: Update database status for student returning
    return jsonify({
        "status": "success",
        "time_in": now
    })

@app.route("/api/equipment/signout", methods=['POST'])
def sign_equipment_out():
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")
