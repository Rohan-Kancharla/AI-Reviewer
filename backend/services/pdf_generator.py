import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_report_pdf(report_data: dict, output_path: str):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = styles['Heading1']
    title_style.alignment = 1
    story.append(Paragraph("AI Resume Analysis Report", title_style))
    story.append(Spacer(1, 20))

    # ATS Score
    story.append(Paragraph(f"<b>ATS Match Score:</b> {report_data.get('ats_score', 'N/A')}/100", styles['Heading2']))
    story.append(Spacer(1, 10))

    # Recommended Role
    story.append(Paragraph(f"<b>Recommended Role:</b> {report_data.get('recommended_role', 'N/A')}", styles['Normal']))
    story.append(Spacer(1, 10))

    # Skills Extracted
    story.append(Paragraph("<b>Extracted Skills:</b>", styles['Heading3']))
    skills = report_data.get('skills', [])
    skills_text = ", ".join(skills) if isinstance(skills, list) else str(skills)
    story.append(Paragraph(skills_text, styles['Normal']))
    story.append(Spacer(1, 10))

    # Missing Skills
    story.append(Paragraph("<b>Missing Skills (Recommended to add):</b>", styles['Heading3']))
    missing_skills = report_data.get('missing_skills', [])
    missing_text = ", ".join(missing_skills) if isinstance(missing_skills, list) else str(missing_skills)
    story.append(Paragraph(missing_text, styles['Normal']))
    story.append(Spacer(1, 10))

    # Improved Summary
    story.append(Paragraph("<b>AI Improved Summary:</b>", styles['Heading3']))
    story.append(Paragraph(report_data.get('improved_summary', ''), styles['Normal']))
    story.append(Spacer(1, 10))

    # Suggestions Data
    story.append(Paragraph("<b>Detailed Suggestions:</b>", styles['Heading3']))
    suggestions = report_data.get('suggestions', [])
    if isinstance(suggestions, list):
        for sugg in suggestions:
            story.append(Paragraph(f"- {sugg}", styles['Normal']))
    else:
        story.append(Paragraph(str(suggestions), styles['Normal']))

    doc.build(story)
    return output_path
