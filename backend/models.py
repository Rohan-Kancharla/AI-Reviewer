from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime
import datetime
from database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) # Clerk user ID
    filename = Column(String)
    extracted_text = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, index=True)
    user_id = Column(String, index=True)
    ats_score = Column(Float)
    skills = Column(String) # JSON list of skills
    missing_skills = Column(String) # JSON list
    recommended_role = Column(String)
    improved_summary = Column(String)
    suggestions = Column(String) # JSON list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
