import os
from email.policy import default
from urllib import request

from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello World"

@app.route("/api/student", methods=['GET'])
def student():
    student_barcode = request.args.get('barcode')
    id= 42,
    name_first = "Jane",
    name_last = "Doe",
    name_official = "Jane Doe",
    year = 11,
    photo = "<base64-or-url>",
    currently_out = False,
    checked_out_equipment = [
        {"equipment_id": 7, "name": "Canon Camera", "time_out": "2026-06-16"},
    ]

    results = {
        "id": id,
        "name_first": name_first,
        "name_last": name_last,
        "name_official": name_official,
        "year": year,
        "photo": photo,
        "currently_out": currently_out,
        "checked_out_equipment": checked_out_equipment
    }
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")
