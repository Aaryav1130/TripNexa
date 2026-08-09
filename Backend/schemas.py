from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

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

class UserUpdate(BaseModel):
    name: Optional[str] = None
    currency: Optional[str] = None
    budget_style: Optional[str] = None

class FavoritePlaceCreate(BaseModel):
    user_email: str
    place_name: str
    place_details: Dict[str, Any]
    place_type: str
