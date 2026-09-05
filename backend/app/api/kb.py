from uuid import uuid4

from fastapi import APIRouter, HTTPException, status, Query
from app.rag.chunk import chunk_text_strategy
from app.rag.store import VectorStore
from app.schemas.kb import (
    KBQueryResult,
    KBSearchRequest,
    KBSearchResponse,
    KBIngestRequest,
    KBIngestResponse,
    KBItem,
    KBListResponse,
    KBDeleteRequest,
    KBDeleteResponse,
)


router = APIRouter(
    prefix="/kb",
    tags=["knowledge-base"]
)

store = VectorStore()


@router.post(
    "/search",
    response_model=KBSearchResponse
)

def search_knowledge_base(
    payload: KBSearchRequest
) -> KBSearchResponse:
    search_results = store.similarity_search(
        queries=payload.queries,
        limit=payload.limit
    )

    results = [
        KBQueryResult(
            query=query,
            matches=matches
        )
        for query, matches in zip(
            payload.queries,
            search_results
        )
    ]

    return KBSearchResponse(results=results)

@router.post(
    "/ingest",
    response_model=KBIngestResponse,
    status_code=status.HTTP_201_CREATED
)
def ingest_knowledge_base(
    payload: KBIngestRequest
) -> KBIngestResponse:
    if payload.overlap >= payload.max_chars:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="overlap must be smaller than max_chars"
        )

    texts: list[str] = []
    ids: list[str] = []
    metadatas: list[dict] = []

    for document in payload.documents:
        document_id = document.id or uuid4().hex

        if payload.chunk:
            chunks = chunk_text_strategy(
                text=document.text,
                strategy=payload.chunk_strategy,
                max_chars=payload.max_chars,
                overlap=payload.overlap,
                delimiters=payload.delimiters
            )
        else:
            chunks = [document.text.strip()]

        for chunk_index, chunk in enumerate(chunks):
            chunk_id = f"{document_id}:{chunk_index}"

            chunk_metadata = {
                **(document.metadata or {}),
                "document_id": document_id,
                "chunk_index": chunk_index
            }

            texts.append(chunk)
            ids.append(chunk_id)
            metadatas.append(chunk_metadata)

    try:
        store.upsert_documents(
            documents=texts,
            ids=ids,
            metadatas=metadatas
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        ) from error

    return KBIngestResponse(
        inserted_ids=ids,
        chunks_added=len(texts)
    )

@router.get(
    "/items",
    response_model=KBListResponse
)
def list_knowledge_base_items(
    limit: int = Query(
        default=20,
        ge=1,
        le=200
    )
) -> KBListResponse:
    stored_items = store.list_documents(
        limit=limit
    )

    items: list[KBItem] = []

    for stored_item in stored_items:
        item = KBItem(
            id=stored_item["id"],
            document=stored_item["document"],
            metadata=stored_item["metadata"]
        )

        items.append(item)

    return KBListResponse(
        total=store.collection.count(),
        items=items
    )

@router.post(
    "/delete",
    response_model=KBDeleteResponse,
    status_code=status.HTTP_200_OK
)

def delete_knowledge_base_items(
    payload:KBDeleteRequest
) -> KBDeleteResponse:
    deleted_count = store.delete_documents(
        ids=payload.ids
    )

    return KBDeleteResponse(
        deleted=deleted_count
    )