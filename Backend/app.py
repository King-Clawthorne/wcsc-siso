import os

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
    photo = "<base64-or-url>"
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
