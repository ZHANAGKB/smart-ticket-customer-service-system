from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from enum import Enum
from app.db.session import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


#user table
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

   #ROM 语法糖  
    tickets: Mapped[list["Tickets"]] = relationship(back_populates="requester") 
    replies: Mapped[list["Reply"]] = relationship(back_populates="author")

#tickets table
class Tickets(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)

    title: Mapped[str] = mapped_column(String(255))

    content: Mapped[str] = mapped_column(Text)

    status: Mapped[str] = mapped_column(String(32), default=TicketStatus.open.value)

    priority: Mapped[str] = mapped_column(String(16), default=Priority.medium.value,index=True)

    tags: Mapped[str | None] = mapped_column(String(255), nullable=True)

    requester_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    #ROM 语法糖
    requester: Mapped["User"] = relationship(back_populates="tickets")
    replies: Mapped[list["Reply"]] = relationship(back_populates="tickets", cascade="all, delete-orphan")


# reply table
class Reply(Base):
    __tablename__ = "reply"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index= True)

    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id"))

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    content: Mapped[str] = mapped_column(Text)

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    #ROM 语法糖
    tickets: Mapped["Tickets"] = relationship(back_populates="replies")
    author: Mapped["User"] = relationship(back_populates="replies")