from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv("VITE_GOOGLE_GEMINI_AI_API_KEY"))

# The model and configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}
gemini_model = genai.GenerativeModel("gemini-flash-latest", generation_config=generation_config)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-travel-planner-gules.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

AI_PROMPT = '''
Generate a Travel Plan for Location: {location}, for {totalDays} days for {companions} companions with a {budget} budget.
You MUST return the response strictly in JSON format containing EXACTLY these three top-level keys:
1. "tripDetails": An object containing basic info about the trip.
2. "hotelOptions": An array of EXACTLY 15 unique hotel objects. Each object MUST have:
   - "hotelName": (string) The name of the hotel
   - "hotelAddress": (string) The full address
   - "pricePerNight": (integer) ACCURATE price STRICTLY converted to Indian Rupees (INR) as a raw integer (e.g. 16500) regardless of the destination. DO NOT USE STRINGS OR SYMBOLS
   - "hotelImageUrl": (string) image url
   - "geoCoordinates": (string) coordinates
   - "ratings": (number) a float like 4.5, DO NOT USE STRINGS
   - "description": (string) brief description
3. "itinerary": An array or object detailing the daily schedule (with placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, timeTravel, bestTimeToVisit).
Do not include any text outside the JSON. Ensure pricing makes logical sense for the {budget} budget in {location} when converted to INR.
'''
@app.post("/api/trips/generate")
async def generate_trip(trip_req: schemas.TripCreate, db: Session = Depends(get_db)):
    try:
        final_prompt = AI_PROMPT.format(
            location=trip_req.location.label,
            totalDays=trip_req.noOfdays,
            companions=trip_req.companions,
            budget=trip_req.budget
        )
        
        # Start chat session and send message
        chat_session = gemini_model.start_chat(history=[])
        result = chat_session.send_message(final_prompt)
        response_text = result.text
        
        # Parse JSON from AI response
        cleaned_text = response_text.replace('```json', '').replace('```', '').strip()
        try:
            trip_data = json.loads(cleaned_text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse AI response as JSON")

        if not trip_data.get('tripDetails') or not trip_data.get('hotelOptions') or not trip_data.get('itinerary'):
            raise HTTPException(status_code=500, detail="Invalid trip data format from AI")

        # Save to Database
        new_trip_id = str(uuid.uuid4())
        new_trip = models.Trip(
            id=new_trip_id,
            user_email=trip_req.userEmail,
            user_selections=trip_req.model_dump(),
            trip_data=trip_data
        )
        db.add(new_trip)
        db.commit()
        db.refresh(new_trip)
        
        return {"trip_id": new_trip_id}
        
    except Exception as e:
        print(f"Error generating trip: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trips/{trip_id}")
async def get_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Restructure to match what frontend expects (Firebase format)
    return {
        "id": trip.id,
        "userEmail": trip.user_email,
        "userSelections": trip.user_selections,
        "TripData": trip.trip_data,
        "createdAt": trip.created_at.isoformat() if trip.created_at else None
    }

@app.get("/api/trips/user/{email}")
async def get_user_trips(email: str, db: Session = Depends(get_db)):
    trips = db.query(models.Trip).filter(models.Trip.user_email == email).all()
    return [
        {
            "id": t.id,
            "userEmail": t.user_email,
            "userSelections": t.user_selections,
            "TripData": t.trip_data,
            "createdAt": t.created_at.isoformat() if t.created_at else None
        } for t in trips
    ]

# Keep chat logic for the "Take AI Help" feature
@app.post("/chat")
async def chat_with_ai(request: Request): 
    try:
        data = await request.json()
        user_message = data.get("message", "")
        session_id = data.get("session_id", "")

        if not user_message or not session_id:
            return {"response": "Missing message or session ID."}
        
        chat_session = gemini_model.start_chat(history=[])
        response = chat_session.send_message(user_message)

        return {"response": response.text}

    except Exception as e:
        print("Error during chat_with_ai:", e)
        return {"response": f"Error: {str(e)}"}
