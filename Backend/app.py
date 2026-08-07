import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from sqlalchemy import select
from sqlalchemy.orm import Session

# Import database engine and ORM models
from database import (
    Destination,
    Equipment,
    EquipmentSignInOut,
    SchoolLeave,
    Student,
    engine,
)

# Serve the built React app (Frontend/dist) as static files.
FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "Frontend",
    "dist",
)

app = Flask(__name__, static_folder=None)
CORS(app)


# -------------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------------

@app.route("/api/student", methods=['GET'])
def student():
    student_barcode = request.args.get('barcode')
    if not student_barcode:
        return jsonify({"error": "Barcode query parameter is required"}), 400

    with Session(engine) as session:
        # Retrieve student by barcode
        query = select(Student).where(Student.barcode == student_barcode)
        student_obj = session.scalar(query)

        if not student_obj:
            return jsonify({"error": f"Student with barcode '{student_barcode}' not found"}), 404

        # Check if the student currently has an open leave record (time_in is None)
        open_leave = session.scalar(
            select(SchoolLeave).where(
                SchoolLeave.student_id == student_obj.id,
                SchoolLeave.time_in.is_(None)
            )
        )
        currently_out = open_leave is not None

        # Fetch active equipment checkouts (time_in is None)
        active_equipment_records = session.scalars(
            select(EquipmentSignInOut).where(
                EquipmentSignInOut.student_id == student_obj.id,
                EquipmentSignInOut.time_in.is_(None)
            )
        ).all()

        checked_out_equipment = []
        for record in active_equipment_records:
            equipment_item = session.get(Equipment, record.equipment_id)
            checked_out_equipment.append({
                "equipment_id": record.equipment_id,
                "name": equipment_item.name if equipment_item else "Unknown Equipment",
                "time_out": str(record.time_out) if record.time_out else None,
            })

        results = {
            "id": student_obj.id,
            "name_first": student_obj.name_first,
            "name_last": student_obj.name_last,
            "name_official": student_obj.name_official,
            "year": student_obj.year,
            "photo": student_obj.photo,
            "currently_out": currently_out,
            "checked_out_equipment": checked_out_equipment
        }
        
        return jsonify(results)


# Sign a student out / in.
@app.route("/api/student/leave", methods=['POST'])
def student_leave():
    payload = request.get_json(silent=True) or {}
    barcode = payload.get("barcode")
    destination_id = payload.get("destinationId") or payload.get("destination_id")
    reason = payload.get("reason")

    if not barcode:
        return jsonify({"error": "Barcode is required"}), 400

    now_time_str = datetime.now(timezone.utc).strftime("%I:%M %p")
    today_date = datetime.now(timezone.utc).date()

    with Session(engine) as session:
        student_obj = session.scalar(select(Student).where(Student.barcode == barcode))
        if not student_obj:
            return jsonify({"error": f"Student with barcode '{barcode}' not found"}), 404

        # Look up destination name if provided
        destination_name = "School"
        if destination_id:
            dest = session.get(Destination, destination_id)
            if dest:
                destination_name = dest.name
            else:
                destination_name = f"Destination #{destination_id}"

        # Check for open leave record
        open_leave = session.scalar(
            select(SchoolLeave).where(
                SchoolLeave.student_id == student_obj.id,
                SchoolLeave.time_in.is_(None)
            )
        )

        if open_leave:
            # Student is returning (Sign In)
            open_leave.time_in = today_date
            session.commit()

            return jsonify({
                "status": "success",
                "action": "signed_in",
                "barcode": barcode,
                "destination_id": destination_id,
                "destination": destination_name,
                "reason": reason,
                "time_out": str(open_leave.time_out),
                "time_in": now_time_str,
            })
        else:
            # Student is leaving (Sign Out)
            new_leave = SchoolLeave(
                student_id=student_obj.id,
                reason=reason,
                time_out=today_date
            )
            session.add(new_leave)
            session.commit()

            return jsonify({
                "status": "success",
                "action": "signed_out",
                "barcode": barcode,
                "destination_id": destination_id,
                "destination": destination_name,
                "reason": reason,
                "time_out": now_time_str,
                "time_in": None,
            })


# Sign equipment out / in.
@app.route("/api/equipment/signout", methods=['POST'])
def equipment_signout():
    payload = request.get_json(silent=True) or {}
    student_barcode = payload.get("studentBarcode") or payload.get("student_barcode")
    equipment_barcode = payload.get("equipmentBarcode") or payload.get("equipment_barcode")

    if not student_barcode or not equipment_barcode:
        return jsonify({"error": "Both studentBarcode and equipmentBarcode are required"}), 400

    now_time_str = datetime.now(timezone.utc).strftime("%I:%M %p")
    today_date = datetime.now(timezone.utc).date()

    with Session(engine) as session:
        student_obj = session.scalar(select(Student).where(Student.barcode == student_barcode))
        if not student_obj:
            return jsonify({"error": f"Student with barcode '{student_barcode}' not found"}), 404

        # Assume equipment_barcode corresponds to Equipment ID
        equipment_id = int(equipment_barcode) if str(equipment_barcode).isdigit() else None
        equipment_obj = session.get(Equipment, equipment_id) if equipment_id else None

        if not equipment_obj:
            return jsonify({"error": f"Equipment with identifier '{equipment_barcode}' not found"}), 404

        # Check if this equipment is currently signed out
        open_record = session.scalar(
            select(EquipmentSignInOut).where(
                EquipmentSignInOut.equipment_id == equipment_obj.id,
                EquipmentSignInOut.time_in.is_(None)
            )
        )

        if open_record:
            # Return equipment (Sign In)
            open_record.time_in = today_date
            session.commit()

            return jsonify({
                "status": "success",
                "action": "signed_in",
                "student_barcode": student_barcode,
                "equipment_barcode": equipment_barcode,
                "time_out": str(open_record.time_out),
                "time_in": now_time_str,
            })
        else:
            # Check out equipment (Sign Out)
            new_record = EquipmentSignInOut(
                student_id=student_obj.id,
                equipment_id=equipment_obj.id,
                time_out=today_date
            )
            session.add(new_record)
            session.commit()

            return jsonify({
                "status": "success",
                "action": "signed_out",
                "student_barcode": student_barcode,
                "equipment_barcode": equipment_barcode,
                "time_out": now_time_str,
                "time_in": None,
            })


# Serve the React single-page app.
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
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
