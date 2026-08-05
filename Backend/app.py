import os
from email.policy import default
from urllib import request

from flask import Flask, jsonify

import database
app = Flask(__name__)


@app.route("/")
def index():
    return "Hello World"

@app.route(rule="/api/student", defaults="hello", methods=['GET'])
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
        "currently_out": "pass",
        "checked_out_equipment": "pass"
    }
    return jsonify(results)


@app.route("/api/student/leave", methods=['POST'])
def sign_student_out():
    pass


@app.route("/api/equipment/signout", methods=['POST'])
def sign_equipment_out():
    pass


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")
