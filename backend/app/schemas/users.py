from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

