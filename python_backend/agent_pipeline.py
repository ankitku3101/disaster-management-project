import os
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from dotenv import load_dotenv

load_dotenv()
# Set up your API key for Groq
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

# Initialize FastAPI app
app = FastAPI(title="Disaster Alert System API")

# Initialize the LLM
llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0)

# Define input models
class DisasterInput(BaseModel):
    location: str = Field(..., description="The user's location")
    disaster_type: str = Field(..., description="Type of disaster (e.g., flood, earthquake, wildfire)")
    description: str = Field(..., description="Description of the disaster situation")

class SafetyInput(BaseModel):
    location: str = Field(..., description="The user's location")
    disaster_type: str = Field(..., description="Type of disaster (e.g., flood, earthquake, wildfire)")
    description: str = Field(..., description="Description of the disaster situation")
    severity: str = Field(..., description="Severity level (low, medium, high)")

# Define response models
class SeverityClassification(BaseModel):
    severity: str = Field(..., description="Classified severity level (low, medium, high)")
    reasoning: str = Field(..., description="Reasoning behind the severity classification")

class SafetyTips(BaseModel):
    immediate_actions: List[str] = Field(..., description="Immediate actions to take")
    preparation_steps: List[str] = Field(..., description="Preparation steps for the disaster")
    evacuation_guidance: Optional[str] = Field(None, description="Evacuation guidance if applicable")
    resources: List[str] = Field(..., description="Useful resources and emergency contacts")

# Agent 1: Severity Classification Agent
def create_severity_classification_agent():
    response_schemas = [
        ResponseSchema(name="severity", description="The severity level of the disaster (low, medium, high)"),
        ResponseSchema(name="reasoning", description="The reasoning behind the severity classification")
    ]
    
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
    format_instructions = output_parser.get_format_instructions()
    
    template = """
    You are a disaster severity classification expert. Your job is to classify disasters based on their severity.
    
    Given the information about a disaster, classify it as LOW, MEDIUM, or HIGH severity.
    
    Location: {location}
    Disaster Type: {disaster_type}
    Description: {description}
    
    Use the following guidelines:
    - LOW: Minimal immediate danger, localized impact, sufficient time to respond, minimal infrastructure damage
    - MEDIUM: Some immediate danger, wider area impact, limited time to respond, moderate infrastructure damage
    - HIGH: Severe immediate danger, widespread impact, urgent response needed, significant infrastructure damage
    
    {format_instructions}
    """
    
    prompt = PromptTemplate(
        template=template,
        input_variables=["location", "disaster_type", "description"],
        partial_variables={"format_instructions": format_instructions}
    )
    
    return LLMChain(llm=llm, prompt=prompt, output_parser=output_parser)

# Agent 2: Safety Tips Agent
def create_safety_tips_agent():
    template = """
    You are a disaster safety expert. Your job is to provide personalized safety tips based on the disaster information.
    
    Location: {location}
    Disaster Type: {disaster_type}
    Description: {description}
    Severity: {severity}
    
    Provide specific, actionable safety tips tailored to this specific situation and location.
    Format your response EXACTLY as follows with JSON format: (Keep it concise and crisp)
    
    {{
        "immediate_actions": ["action1", "action2", "action3", ...],
        "preparation_steps": ["step1", "step2", "step3", ...],
        "evacuation_guidance": "Clear evacuation guidance if needed"
    }}
    
    Ensure each field is properly formatted - immediate_actions, and preparation_steps MUST be valid JSON arrays (lists).
    """
    
    prompt = PromptTemplate(
        template=template,
        input_variables=["location", "disaster_type", "description", "severity"]
    )
    
    class CustomLLMChain(LLMChain):
        def run(self, *args, **kwargs):
            output = super().run(*args, **kwargs)
            return self.process_output(output)
            
        def process_output(self, output):
            import json
            import re
            
            # Try to extract JSON if it's not already proper JSON
            if not output.strip().startswith('{'):
                # Look for JSON patterns using regex
                match = re.search(r'({.*})', output, re.DOTALL)
                if match:
                    output = match.group(1)
            
            try:
                # Parse the response as JSON
                result = json.loads(output)
                
                # Ensure all required fields exist and are of correct type
                if "immediate_actions" not in result or not isinstance(result["immediate_actions"], list):
                    result["immediate_actions"] = [result.get("immediate_actions", "No immediate actions provided")]
                    
                if "preparation_steps" not in result or not isinstance(result["preparation_steps"], list):
                    result["preparation_steps"] = [result.get("preparation_steps", "No preparation steps provided")]
                    
                if "resources" not in result or not isinstance(result["resources"], list):
                    result["resources"] = [result.get("resources", "No resources provided")]
                    
                if "evacuation_guidance" not in result:
                    result["evacuation_guidance"] = "No specific evacuation guidance provided"
                
                return result
                
            except json.JSONDecodeError:
                # If we can't parse as JSON, create a structured response
                return {
                    "immediate_actions": [output.split('.')[0] + "."] if output else ["Seek emergency assistance immediately"],
                    "preparation_steps": ["Stay informed about the situation", "Follow instructions from local authorities"],
                    "evacuation_guidance": "Evacuate if instructed by local authorities",
                    "resources": ["National Emergency Number: 108", "Local disaster management agency"]
                }
    
    return CustomLLMChain(llm=llm, prompt=prompt)

# Initialize agents
severity_agent = create_severity_classification_agent()
safety_agent = create_safety_tips_agent()

# API Endpoints
@app.post("/classify-severity", response_model=SeverityClassification)
async def classify_severity(disaster_input: DisasterInput):
    try:
        result = severity_agent.run(
            location=disaster_input.location,
            disaster_type=disaster_input.disaster_type,
            description=disaster_input.description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error classifying severity: {str(e)}")

# API Endpoints
@app.post("/safety-tips", response_model=SafetyTips)
async def get_safety_tips(safety_input: SafetyInput):
    try:
        result = safety_agent.run(
            location=safety_input.location,
            disaster_type=safety_input.disaster_type,
            description=safety_input.description,
            severity=safety_input.severity
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating safety tips: {str(e)}")

# Combined endpoint that calls both agents in sequence
@app.post("/disaster-alert")
async def disaster_alert(disaster_input: DisasterInput):
    try:
        # Step 1: Classify severity
        severity_result = severity_agent.run(
            location=disaster_input.location,
            disaster_type=disaster_input.disaster_type,
            description=disaster_input.description
        )
        
        # Step 2: Get safety tips based on severity classification
        safety_input = SafetyInput(
            location=disaster_input.location,
            disaster_type=disaster_input.disaster_type,
            description=disaster_input.description,
            severity=severity_result["severity"]
        )
        
        safety_result = safety_agent.run(
            location=safety_input.location,
            disaster_type=safety_input.disaster_type,
            description=safety_input.description,
            severity=safety_input.severity
        )
        
        # Return combined result
        return {
            "severity_classification": severity_result,
            "safety_tips": safety_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing disaster alert: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)