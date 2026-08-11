from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import Tickets,User
from app.db.session import get_db
from app.schemas.tickets import ticketCreate, ticketRead, ticketUpdate

router = APIRouter(prefix="/tickets", tags=["tickets"])

# create the ticket
# response_model 是返回给前端的格式
@router.post("", response_model=ticketRead, status_code=status.HTTP_201_CREATED)

# payload 是前端应该发给后端的内容
async def ticketCreate(payload: ticketCreate, db: AsyncSession = Depends(get_db)) -> Tickets:
    requester = await db.get(User, payload.requester_id)
    if requester is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requester not found")
    
    tickets = Tickets(title = payload.title, 
                      content = payload.content, 
                      tags = payload.tags, 
                      status = payload.status,
                      priority = payload.priority, 
                      requester_id = payload.requester_id)
    db.add(tickets)
    await db.commit()
    await db.refresh(tickets)
    return tickets

# get list of tickets
@router.get("", response_model=list[ticketRead])

async def listTickets(db: AsyncSession = Depends(get_db)) -> list[Tickets]:
    result = await db.execute(select(Tickets))

    return result.scalars().all()

# get the tickets with the ticket id
@router.get("/{tickets_id}", response_model=ticketRead)

async def getTikcets(tickets_id: int, db: AsyncSession = Depends(get_db)) -> Tickets:
    result = await db.get(Tickets, tickets_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return result


# Update the ticket details
@router.put("/{tickets_id}", response_model=ticketUpdate, status_code=status.HTTP_200_OK)

async def updateTickets(tickets_id: int, payload: ticketUpdate, db: AsyncSession = Depends(get_db)) -> Tickets:
    ticket = await db.get(Tickets, tickets_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    # Only change the data that need to update. will not effect other data.
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(ticket, field, value)

    await db.commit()
    await db.refresh(ticket)
    return ticket

@router.delete("/{tickets_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteTickets(tickets_id: int, db: AsyncSession = Depends(get_db)) -> None:
    ticket = await db.get(Tickets, tickets_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    await db.delete(ticket)
    await db.commit()

    