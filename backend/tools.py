from langchain.tools import tool
import pdfplumber
import os

@tool
def extract_text_from_pdf(filepath: str) -> str:
    """Extracts text from a PDF file located at filepath."""
    if not os.path.exists(filepath):
        return "Error: File not found."
    try:
        text = ""
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error extracting text: {e}"

@tool
def extract_skills(resume_text: str) -> str:
    """Extracts a categorized list of skills from the resume text. 
    Use this to pull out Programming Languages, Frameworks, Databases, Cloud, and Soft Skills.
    """
    # This will typically be powered by the LLM itself or regex. For the tool calling agent, we can mock it here
    # or have the LLM do it without a tool. Actually, let's keep it as a tool that could theoretically wrap another LLM call.
    return "Extracted Skills: You should evaluate the text and list the technical and soft skills."

@tool
def calculate_ats_score(resume_text: str) -> str:
    """Calculates an ATS (Applicant Tracking System) score out of 100 based on the resume text.
    It returns a mock calculated score based on length and keyword density.
    """
    length = len(resume_text)
    score = min((length / 3000) * 100, 100)
    # Give a somewhat realistic score
    if score < 40: score = 40
    return f"Calculated ATS Score: {int(score)}/100"

@tool
def suggest_job_role(resume_text: str, skills: str) -> str:
    """Suggests the best job role match based on given resume text and skills (e.g., Backend Engineer, Frontend Engineer, etc.)."""
    return "Based on your analysis, suggest a suitable job role using your knowledge."

@tool
def write_professional_summary(resume_text: str) -> str:
    """Rewrites a strong, active professional summary based on the resume text."""
    return "Instruction: Rewrite the professional summary nicely using the provided text."
