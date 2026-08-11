from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from app.db.models import User
from app.db.session import get_db
from app.schemas.users import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)

async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> User:
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    user = User(email=payload.email, name=payload.name)
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    await db.refresh(user)
    return user

@router.get("", response_model=list[UserRead])

async def list_user(db: AsyncSession = Depends(get_db)) -> list[User]:
    result = await db.execute(select(User))
    return result.scalars().all()

@router.get("/{user_id}", response_model=UserRead)

async def get_user(user_id: int, db: AsyncSession = Depends(get_db)) -> User:
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
