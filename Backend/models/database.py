from typing import List, Optional
import datetime
from sqlalchemy import ForeignKey, Integer, String, Text, Date
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import create_engine

# Create an in-memory SQLite database for testing
engine = create_engine("sqlite://", echo=True)

class Base(DeclarativeBase):
    # Base class for SQLAlchemy ORM models
    pass


class EquipmentType(Base):
    __tablename__ = "equipment_type"

    # Primary key for equipment type
    id: Mapped[int] = mapped_column(primary_key=True)

    # Name of the equipment type (e.g., "Laptop", "Camera")
    name: Mapped[str] = mapped_column(String(), nullable=False)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"Equipment(id={self.id!r}, name={self.name!r},)"


class Equipment(Base):
    __tablename__ = "equipment"

    # Primary key for equipment
    id: Mapped[int] = mapped_column(primary_key=True)

    # Equipment type (should normally be a ForeignKey, but left unchanged)
    equipment_type: Mapped[EquipmentType] = mapped_column(nullable=False)

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
    id: Mapped[int] = mapped_column(primary_key=True)

    # ID of equipment being signed out
    equipment_id: Mapped[int] = mapped_column(nullable=False)

    # ID of student signing equipment out
    student_id: Mapped[int] = mapped_column(nullable=False)

    # Date the equipment was taken
    time_out: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    # Date the equipment was returned
    time_in: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"EquipmentSignInOut(id={self.id!r}, student_id={self.student_id!r}, equipment_id={self.equipment_id!r}), time_out={self.time_out!r}, time_in={self.time_in!r})"


class SchoolLeave(Base):
    __tablename__ = "school_leave"

    # Primary key for school leave record
    id: Mapped[int] = mapped_column(primary_key=True)

    # Equipment ID associated with the leave (if any)
    equipment_id: Mapped[int] = mapped_column(nullable=False)

    # Student ID taking leave
    student_id: Mapped[int] = mapped_column(nullable=False)

    # Reason for leaving school
    reason: Mapped[str] = mapped_column(Text)

    # Time the student left
    time_out: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    # Time the student returned
    time_in: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"School_Leave(id={self.id!r}, reason={self.reason!r}, equipment_id={self.equipment_id!r} time_out={self.time_out!r}, time_in={self.time_in!r})"


class Destination(Base):
    __tablename__ = "school_leave"  # NOTE: duplicates table name, but unchanged per your request

    # Primary key for destination
    id: Mapped[int] = mapped_column(primary_key=True)

    # Name of the destination (e.g., "Nurse", "Office")
    name: Mapped[str] = mapped_column(String(), nullable=False)

    # Icon representing the destination
    icon: Mapped[str] = mapped_column(Text)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"Destination(id={self.id!r}, name={self.name!r}, type={self.icon!r})"


class Student(Base):
    __tablename__ = "students"

    # Primary key for student
    id: Mapped[int] = mapped_column(primary_key=True)

    # First name
    name_first: Mapped[str] = mapped_column(String(), nullable=False)

    # Last name
    name_last: Mapped[str] = mapped_column(String(), nullable=False)

    # Official full name
    name_official: Mapped[str] = mapped_column(String())

    # Year level of the student
    year: Mapped[int] = mapped_column(Integer)

    # Path or URL to student photo
    photo: Mapped[str] = mapped_column(Text)

    def __repr__(self) -> str:
        # String representation for debugging
        return f"User(id={self.id!r}, first_name={self.name_first!r}, name_last={self.name_last!r}, name_last={self.name_official!r}, photo={self.photo!r})"


# Create all tables in the database
Base.metadata.create_all(engine)
