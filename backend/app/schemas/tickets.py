from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Literal

TicketStatus = Literal["open", "in_progress", "resolved", "closed"]
PriorityStatus = Literal["low", "medium", "high", "urgent"]

class ticketBase(BaseModel):
    title: str
    content: str
    tags: str | None = None
    status : TicketStatus | None = "open"
    priority : PriorityStatus | None = "medium"


class ticketCreate(ticketBase):
    requester_id: int

class ticketRead(ticketBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    requester_id: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

class ticketUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    status : TicketStatus | None = None
    priority : PriorityStatus | None = None
    tags: str | None = None


class replyBase(BaseModel):
    content: str
    author_id: int

class replyCreate(replyBase):
    pass

class replyRead(replyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: int
    updated_at: datetime





