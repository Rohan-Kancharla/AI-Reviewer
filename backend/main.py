from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, database
import json
import os

app = FastAPI(title="AI Resume Reviewer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def read_root():
    return {"message": "AI Resume Reviewer API is running"}

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    # Save file to a temporary location
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
        
    return {"message": "File uploaded successfully", "filename": file.filename, "temp_path": file_location}

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), user_id: str = Form(default="guest"), db: Session = Depends(database.get_db)):
    try:
        # Save file temporarily
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb+") as file_object:
            content = await file.read()
            file_object.write(content)
        
        # Check if OpenAI key exists, if not use a smart mock
        if not os.environ.get("OPENAI_API_KEY"):
            # Mock Agent Workflow when API key is missing
            import fitz # PyMuPDF
            text = ""
            if file.filename.endswith(".pdf"):
                doc = fitz.open(file_location)
                for page in doc:
                    text += page.get_text()
            
            # Simple mock evaluation based on text length
            score = min(40 + len(text) // 100, 95)
            
            report = {
                "ats_score": score,
                "skills": ["JavaScript", "React", "Python", "Problem Solving", "Agile"],
                "missing_skills": ["AWS", "Docker", "Kubernetes"],
                "recommended_role": "Full Stack Engineer" if "react" in text.lower() else "Software Engineer",
                "improved_summary": "An experienced software engineer with a strong background in developing scalable applications. Proven ability to optimize performance and deliver impactful solutions.",
                "suggestions": [
                    "Quantify your achievements with solid metrics (e.g., 'increased performance by 20%').",
                    "Add more industry-standard keywords related to cloud deployment.",
                    "Ensure consistent formatting in the experience section."
                ]
            }
            return {"status": "success", "report": report}
            
        else:
            # Use real Langchain Agent
            from agent import get_agent_executor
            agent = get_agent_executor()
            result = agent.invoke({
                "input": f"Please process the resume located at {file_location}. Follow the workflow: extract text, extract skills, calculate ATS, suggest job, write summary, and provide a full analysis report in JSON format."
            })
            
            # We would parse the JSON output from the agent here
            return {"status": "success", "report": result["output"]}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel
class ReportData(BaseModel):
    ats_score: float
    skills: list
    missing_skills: list
    recommended_role: str
    improved_summary: str
    suggestions: list

from fastapi.responses import FileResponse
from services.pdf_generator import generate_report_pdf
import time

@app.post("/download")
async def download_report(data: ReportData):
    try:
        report_dict = data.model_dump()
        output_filename = f"report_{int(time.time())}.pdf"
        pdf_path = generate_report_pdf(report_dict, output_filename)
        return FileResponse(path=pdf_path, filename="Resume_Report.pdf", media_type='application/pdf')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
