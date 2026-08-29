from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import Reply,Tickets, User
from app.db.session import get_db
from app.schemas.tickets import replyCreate, replyRead

router = APIRouter(prefix="/tickets/{tickets_id}/replies", tags= ["replies"])

@router.post("", response_model=replyRead ,status_code=status.HTTP_201_CREATED)

async def create_reply(tickets_id: int, payload: replyCreate, db: AsyncSession = Depends(get_db)) -> Reply:

    author = await db.get(User, payload.author_id)
    if author is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")

    ticket = await db.get(Tickets, tickets_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    reply = Reply(
        ticket_id = tickets_id,
        author_id = payload.author_id,
        content = payload.content
    )

    db.add(reply)
    await db.commit()
    await db.refresh(reply)
    return reply

@router.get("", response_model=list[replyRead])

async def list_reply(tickets_id:int, db: AsyncSession = Depends(get_db)) -> list[Reply]:
    ticket = await db.get(Tickets, tickets_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    result = await db.execute(select(Reply).where(Reply.ticket_id == tickets_id).order_by(Reply.id))
    return result.scalars().all()