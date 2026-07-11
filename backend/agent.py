import os
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from tools import (
    extract_text_from_pdf, 
    extract_skills, 
    calculate_ats_score, 
    suggest_job_role, 
    write_professional_summary
)

def get_agent_executor():
    # Make sure OPENAI_API_KEY is loaded in environment variables
    llm = ChatOpenAI(model="gpt-4", temperature=0)

    tools = [
        extract_text_from_pdf,
        extract_skills,
        calculate_ats_score,
        suggest_job_role,
        write_professional_summary
    ]

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an autonomous AI Resume Reviewer Agent. You have access to tools that can parse PDFs, extract skills, calculate ATS scores, and suggest job roles. Your job is to process a resume and execute a multi-step workflow. Always format your output as a comprehensive report when finished."),
        ("user", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    return agent_executor
