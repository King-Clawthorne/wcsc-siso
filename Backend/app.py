import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request, send_from_directory

# Serve the built React app (Frontend/dist) as static files. The frontend lives
# in a sibling directory, so resolve its build output relative to this file.
FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "Frontend",
    "dist",
)

app = Flask(__name__, static_folder=None)


@app.route("/api/student", methods=['GET'])
def student():
    student_barcode = request.args.get('barcode')
    id = 42
    name_first = "Jane"
    name_last = "Doe"
    name_official = "Jane Doe"
    year = 11
    photo = "https://derpicdn.net/img/2026/7/1/3846304/medium.jpg"
    currently_out = False
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


# Sign a student out / in. The frontend POSTs the scanned barcode (plus an
# optional destination/reason when signing out); the backend toggles the
# student's state. Stub implementation until the database is wired up.
@app.route("/api/student/leave", methods=['POST'])
def student_leave():
    payload = request.get_json(silent=True) or {}
    barcode = payload.get("barcode")
    destination_id = payload.get("destination_id")
    reason = payload.get("reason")
    now = datetime.now(timezone.utc).isoformat()

    return jsonify({
        "barcode": barcode,
        "destination_id": destination_id,
        "destination": "Newmarket" if destination_id else "School",
        "reason": reason,
        "time_out": now,
        "time_in": now,
    })


# Sign equipment out / in. The frontend POSTs the student barcode plus the
# scanned equipment barcode; the backend toggles the equipment's state. Stub
# implementation until the database is wired up.
@app.route("/api/equipment/signout", methods=['POST'])
def equipment_signout():
    payload = request.get_json(silent=True) or {}
    student_barcode = payload.get("student_barcode")
    equipment_barcode = payload.get("equipment_barcode")
    now = datetime.now(timezone.utc).isoformat()

    return jsonify({
        "student_barcode": student_barcode,
        "equipment_barcode": equipment_barcode,
        "time_out": now,
        "time_in": now,
    })


# Serve the React single-page app. Any path that isn't an /api route falls
# through to here: if a matching static file exists (JS/CSS/assets) it's
# returned, otherwise index.html is served so client-side routing works on
# refresh of /sign-in, /sign-out, etc.
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    full_path = os.path.join(FRONTEND_DIST, path)
    if path and os.path.isfile(full_path):
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")
