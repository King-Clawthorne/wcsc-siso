import datetime
from sqlalchemy.orm import Session

# Import models and engine from your database module
from database import (
    Base,
    Destination,
    Equipment,
    EquipmentSignInOut,
    EquipmentType,
    SchoolLeave,
    Student,
    engine,
)


def seed_database():
    print("Recreating database tables...")
    # Drop and recreate all tables for a clean seed
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        print("Seeding Equipment Types...")
        camera_type = EquipmentType(name="Camera")
        laptop_type = EquipmentType(name="Laptop")
        audio_type = EquipmentType(name="Audio Equipment")
        session.add_all([camera_type, laptop_type, audio_type])
        session.commit()

        print("Seeding Equipment...")
        equipments = [
            Equipment(
                equipment_type_id=camera_type.id,
                name="Canon EOS Camera",
                date_purchased=datetime.date(2023, 5, 12),
            ),
            Equipment(
                equipment_type_id=camera_type.id,
                name="Sony Alpha Camera",
                date_purchased=datetime.date(2024, 1, 20),
            ),
            Equipment(
                equipment_type_id=laptop_type.id,
                name="MacBook Air M2",
                date_purchased=datetime.date(2023, 9, 1),
            ),
            Equipment(
                equipment_type_id=audio_type.id,
                name="Røde Wireless Mic",
                date_purchased=datetime.date(2024, 3, 15),
            ),
        ]
        session.add_all(equipments)
        session.commit()

        print("Seeding Destinations...")
        destinations = [
            Destination(name="Nurse's Office", icon="hospital"),
            Destination(name="Main Office", icon="building"),
            Destination(name="Library", icon="book"),
            Destination(name="Counselor", icon="user"),
        ]
        session.add_all(destinations)

        print("Seeding Students...")
        students = [
            Student(
                barcode="10001",
                name_first="Jane",
                name_last="Doe",
                name_official="Jane Elizabeth Doe",
                year=11,
                photo="https://derpicdn.net/img/2026/7/1/3846304/medium.jpg",
            ),
            Student(
                barcode="10002",
                name_first="John",
                name_last="Smith",
                name_official="Johnathan Smith",
                year=12,
                photo="https://via.placeholder.com/150",
            ),
            Student(
                barcode="10003",
                name_first="Alex",
                name_last="Johnson",
                name_official="Alexander Johnson",
                year=10,
                photo="https://via.placeholder.com/150",
            ),
        ]
        session.add_all(students)
        session.commit()

        print("Seeding Activity Records...")
        # Active camera checkout for Jane Doe (matches original stub test scenario)
        checkout_1 = EquipmentSignInOut(
            student_id=students[0].id,
            equipment_id=equipments[0].id,
            time_out=datetime.date(2026, 6, 16),
            time_in=None,  # Currently checked out
        )

        # Active school leave record for John Smith
        leave_1 = SchoolLeave(
            student_id=students[1].id,
            reason="Medical Appointment",
            time_out=datetime.date(2026, 8, 7),
            time_in=None,  # Currently out
        )

        session.add_all([checkout_1, leave_1])
        session.commit()

        print("\n✨ Database successfully seeded!")


if __name__ == "__main__":
    seed_database()
