from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class LocationSchema(BaseModel):
    label: str
    value: Dict[str, Any]

class TripCreate(BaseModel):
    location: LocationSchema
    noOfdays: str
    budget: str
    companions: str
    userEmail: str

class TripResponse(BaseModel):
    id: str
    user_email: str
    user_selections: Dict[str, Any]
    trip_data: Dict[str, Any]
    created_at: str

    class Config:
        orm_mode = True
