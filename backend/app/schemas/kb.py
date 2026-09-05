from typing import Any, Literal

from pydantic import BaseModel, Field


# Search

class KBSearchRequest(BaseModel):
    queries: list[str]
    limit: int = Field(default=5, ge=1, le=20)


class KBMatch(BaseModel):
    id: str
    document: str
    metadata: dict[str, Any] | None = None
    distance: float


class KBQueryResult(BaseModel):
    query: str
    matches: list[KBMatch]


class KBSearchResponse(BaseModel):
    results: list[KBQueryResult]


# Ingest

class KBDocument(BaseModel):
    id: str | None = None
    text: str = Field(min_length=1)
    metadata: dict[str, Any] | None = None


class KBIngestRequest(BaseModel):
    documents: list[KBDocument] = Field(min_length=1)
    chunk: bool = True
    chunk_strategy: Literal["window", "punctuation"] = "window"
    max_chars: int = Field(default=600, gt=0)
    overlap: int = Field(default=80, ge=0)
    delimiters: str | None = None


class KBIngestResponse(BaseModel):
    inserted_ids: list[str]
    chunks_added: int


# Items

class KBItem(BaseModel):
    id: str
    document: str | None = None
    metadata: dict[str, Any] | None = None


class KBListResponse(BaseModel):
    total: int
    items: list[KBItem]


# Delete

class KBDeleteRequest(BaseModel):
    ids: list[str] = Field(min_length=1)


class KBDeleteResponse(BaseModel):
    deleted: int