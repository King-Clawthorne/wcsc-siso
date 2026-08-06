import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# Serve the built React app (Frontend/dist) as static files.
FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "Frontend",
    "dist",
)

app = Flask(__name__, static_folder=None)
CORS(app)


@app.route("/api/student", methods=['GET'])
def student():
    student_barcode = request.args.get('barcode')
    
    # Stub response matching expected frontend data types
    results = {
        "id": 42,
        "name_first": "Jane",
        "name_last": "Doe",
        "name_official": "Jane Doe",
        "year": 11,
        "photo": "https://derpicdn.net/img/2026/7/1/3846304/medium.jpg",
        "currently_out": False,
        "checked_out_equipment": [
            {"equipment_id": 7, "name": "Canon Camera", "time_out": "2026-06-16"},
        ]
    }
    return jsonify(results)


# Sign a student out / in.
@app.route("/api/student/leave", methods=['POST'])
def student_leave():
    payload = request.get_json(silent=True) or {}
    barcode = payload.get("barcode")
    
    # Support both camelCase (from JS) and snake_case keys
    destination_id = payload.get("destinationId") or payload.get("destination_id")
    reason = payload.get("reason")
    now = datetime.now(timezone.utc).strftime("%I:%M %p")

    return jsonify({
        "status": "success",
        "barcode": barcode,
        "destination_id": destination_id,
        "destination": f"Destination #{destination_id}" if destination_id else "School",
        "reason": reason,
        "time_out": now,
        "time_in": now,
    })


# Sign equipment out / in.
@app.route("/api/equipment/signout", methods=['POST'])
def equipment_signout():
    payload = request.get_json(silent=True) or {}
    
    # React hook sends camelCase keys: studentBarcode & equipmentBarcode
    student_barcode = payload.get("studentBarcode") or payload.get("student_barcode")
    equipment_barcode = payload.get("equipmentBarcode") or payload.get("equipment_barcode")
    now = datetime.now(timezone.utc).strftime("%I:%M %p")

    return jsonify({
        "status": "success",
        "student_barcode": student_barcode,
        "equipment_barcode": equipment_barcode,
        "time_out": now,
        "time_in": now,
    })


# Serve the React single-page app.
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    # Prevent missing /api/ requests from falling through to returning index.html
    if path.startswith("api/"):
        return jsonify({"error": f"API endpoint '/{path}' not found"}), 404

    full_path = os.path.join(FRONTEND_DIST, path)
    if path and os.path.isfile(full_path):
        return send_from_directory(FRONTEND_DIST, path)

    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(FRONTEND_DIST, "index.html")

    return jsonify({
        "error": "dist/index.html missing on server",
        "looked_in": FRONTEND_DIST,
        "tip": "Verify build command: cd Frontend && npm install && npm run build"
    }), 404


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")
