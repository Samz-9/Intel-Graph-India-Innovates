import os
import json
from google import genai
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# 1. Load the environment variables from the .env file
load_dotenv()
API_KEY = os.getenv("INTERDEPENDENCY_API_KEY")

if not API_KEY:
    raise ValueError("API Key not found! Make sure your .env file is set up correctly.")

# 2. Initialize Client (Timeout explicitly removed)
client = genai.Client(api_key=API_KEY)

# 3. Define the exact JSON structure your frontend expects
class Relationship(BaseModel):
    source: str = Field(description="The first country (e.g., 'USA')")
    target: str = Field(description="The second country (e.g., 'China')")
    type: str = Field(description="Short summary of the relationship")
    description: str = Field(description="1-sentence explanation")
    intensity: int = Field(description="Scale of 1-5 representing connection strength")

class GraphData(BaseModel):
    relationships: list[Relationship]

def get_interdependence_data(raw_text: str) -> str:
    """Extracts data and returns it as a JSON string for the frontend."""
    
    prompt = f"""
    Analyze the following text about geopolitical and economic relationships.
    Extract the bilateral relationships specifically between these four countries: USA, China, India, and Russia.
    Do not include other countries. Return the data exactly as requested by the schema.
    
    TEXT TO ANALYZE:
    {raw_text}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": GraphData,
                "temperature": 0.1, 
            }
        )
        
        # Convert the parsed Python object directly into a JSON string
        return json.dumps(response.parsed.model_dump(), indent=2)
        
    except Exception as e:
        # Return a safe error JSON so your frontend doesn't crash
        return json.dumps({"error": str(e), "relationships": []})

if __name__ == "__main__":
    sample_text = """
    The global economy is currently defined by the complex web between four major powers. 
    The USA and China remain deeply intertwined, with America relying on Chinese manufacturing and 
    China needing the massive US consumer market. Meanwhile, Western sanctions have severed almost 
    all economic ties between the USA and Russia. This isolation has pushed Russia into a tight 
    Energy-Manufacturing Axis with China. India maintains a Strategic Tech Partnership with the USA. 
    However, India still heavily relies on China for industrial machinery. Interestingly, India has 
    transitioned their historic arms-trade relationship with Russia into a heavy energy reliance.
    """
    
    # Run the function and print the text output
    frontend_json_payload = get_interdependence_data(sample_text)
    print(frontend_json_payload)