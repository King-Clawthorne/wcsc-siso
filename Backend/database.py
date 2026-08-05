import datetime
from pathlib import Path
from sqlalchemy import ForeignKey, Integer, String, Text, Date, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session


# Create an in-memory SQLite database for testing
databasePath = Path(__file__).resolve().parent / "school.db"
engine = create_engine(f"sqlite:///{databasePath}", echo=True)

class Base(DeclarativeBase):
    # Base class for SQLAlchemy ORM models
    pass


class EquipmentType(Base):
    __tablename__ = "equipment_type"

    # Primary key for equipment type
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False)

    # Name of the equipment type (e.g., "Laptop", "Camera")
    name: Mapped[str] = mapped_column(String(), nullable=False)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"Equipment(id={self.id!r}, name={self.name!r},)"


class Equipment(Base):
    __tablename__ = "equipment"

    # Primary key for equipment
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)

    # Equipment type (should normally be a ForeignKey, but left unchanged)
    equipment_type_id: Mapped[int] = mapped_column(ForeignKey("equipment_type.id"), nullable=False)
    equipment_type: Mapped["EquipmentType"] = relationship()

    # Name of the equipment item
    name: Mapped[str] = mapped_column(String(), nullable=False)

    # Date the equipment was purchased
    date_purchased: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"Equipment(id={self.id!r}, name={self.name!r}, equipment_type={self.equipment_type!r}), date_purchased={self.date_purchased!r})"


class EquipmentSignInOut(Base):
    __tablename__ = "equipment_sign_out"

    # Primary key for sign-in/out record
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)

    # ID of equipment being signed out
    equipment_id: Mapped[int] = mapped_column(ForeignKey("equipment.id"), nullable=False)

    # ID of student signing equipment out
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)

    # Date the equipment was taken
    time_out: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    # Date the equipment was returned
    time_in: Mapped[datetime.date] = mapped_column(Date, nullable=True)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"EquipmentSignInOut(id={self.id!r}, student_id={self.student_id!r}, equipment_id={self.equipment_id!r}), time_out={self.time_out!r}, time_in={self.time_in!r})"


class SchoolLeave(Base):
    __tablename__ = "school_leave"

    # Primary key for school leave record
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)

    # Student ID taking leave
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False)

    # Reason for leaving school
    reason: Mapped[str] = mapped_column(Text, nullable=True)

    # Time the student left
    time_out: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    # Time the student returned
    time_in: Mapped[datetime.date] = mapped_column(Date, nullable=True)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"School_Leave(id={self.id!r}, reason={self.reason!r}, time_out={self.time_out!r}, time_in={self.time_in!r})"


class Destination(Base):
    __tablename__ = "destination"  # NOTE: duplicates table name, but unchanged per your request

    # Primary key for destination
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)

    # Name of the destination (e.g., "Nurse", "Office")
    name: Mapped[str] = mapped_column(String(), nullable=False)

    # Icon representing the destination
    icon: Mapped[str] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"Destination(id={self.id!r}, name={self.name!r}, type={self.icon!r})"


class Student(Base):
    __tablename__ = "students"

    # Primary key for student
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)

    barcode: Mapped[str] = mapped_column(Text, nullable=False, unique=True, index=True)

    # First name
    name_first: Mapped[str] = mapped_column(String(), nullable=False)

    # Last name
    name_last: Mapped[str] = mapped_column(String(), nullable=False)

    # Official full name
    name_official: Mapped[str] = mapped_column(String(), nullable=True)

    # Year level of the student
    year: Mapped[int] = mapped_column(Integer, nullable=False)

    # Path or URL to student photo
    photo: Mapped[str] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"User(id={self.id!r}, first_name={self.name_first!r}, name_last={self.name_last!r}, name_last={self.name_official!r}, photo={self.photo!r})"


def get_student(student_barcode: str) -> Student | None:
    """
    Retrieves a single student by their barcode.
    Requires a student with the barcode being input to avoid passive aggressive comment
    """

    with Session(engine) as session:
        # 1. Build the select statement targeting the barcode column
        studentQuery = select(Student).where(Student.barcode == student_barcode)

        # 2. Execute the statement and get the first scalar result (or None)
        selectedStudent = session.scalar(studentQuery)

        if selectedStudent:
            session.expunge(selectedStudent)
            return selectedStudent
        else:
            print("How am I supposed to find an imaginary student💔🥀")
            print("Barcode inputted must match the barcode of a student in the database")
            return None


# Create all tables in the database
Base.metadata.create_all(engine)


if __name__ == "__main__":
    print(f"starts here:\n{get_student(input('Jimmy'))}")