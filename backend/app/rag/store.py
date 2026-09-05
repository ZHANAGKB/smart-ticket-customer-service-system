from pathlib import Path

import chromadb
from chromadb.api.models.Collection import Collection

from app.rag.embeddings import (
    EmbeddingProvider,
    SentenceTransformerEmbedding,
)


DEFAULT_PERSIST_DIRECTORY = (
    Path(__file__).resolve().parents[2] / "vector_store"
)


class VectorStore:
    def __init__(
        self,
        persist_directory: str | Path = DEFAULT_PERSIST_DIRECTORY,
        collection_name: str = "knowledge_base",
        embedding_provider: EmbeddingProvider | None = None
    ):
        self.embedding_provider = (
            embedding_provider
            or SentenceTransformerEmbedding()
        )

        persist_path = Path(persist_directory)

        persist_path.mkdir(
            parents=True,
            exist_ok=True
        )

        # Create a persistent ChromaDB client
        self.client = chromadb.PersistentClient(
            path=str(persist_path)
        )

        self.collection: Collection = (
            self.client.get_or_create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        )

    def upsert_documents(
            self,
            documents: list[str],
            ids: list[str],
            metadatas: list[dict] | None = None
    ) -> None:
        if not documents:
            return

        if len(documents) != len(ids):
            raise ValueError (
                "documents and ids must have the same length"
            )

        if metadatas is not None and len(metadatas) != len(documents):
            raise ValueError(
                "metadatas and documents must have the same length"
            )

        embeddings = self.embedding_provider.embed_documents(
            documents
        )

        self.collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

    def similarity_search(
            self,
            queries: list[str],
            limit: int = 5
    )-> list[list[dict]]:
        if any(not query.strip() for query in queries):
            raise ValueError("query cannot be empty")

        if limit <= 0:
            raise ValueError("limit must be greater than 0")

        query_embeddings = (
            self.embedding_provider.embed_queries(queries)
        )

        result = self.collection.query(
            query_embeddings=query_embeddings,
            n_results=limit,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

        all_matches: list[list[dict]] = []

        for query_index in range(len(queries)):
            query_matches: list[dict] = []

            for document_id, document, metadata, distance in zip(
                result["ids"][query_index],
                result["documents"][query_index],
                result["metadatas"][query_index],
                result["distances"][query_index]
            ):
                query_matches.append({
                    "id": document_id,
                    "document": document,
                    "metadata": metadata,
                    "distance": distance
                })

            all_matches.append(query_matches)

        return all_matches

    def list_documents(
        self,
        limit: int = 100
    ) -> list[dict]:
        if limit <= 0:
            raise ValueError("limit must be greater than 0")

        result = self.collection.get(
            limit=limit,
            include=[
                "documents",
                "metadatas"
            ]
        )

        documents = result["documents"] or []
        metadatas = result["metadatas"] or []


        items: list[dict] = []

        for document_id, document, metadata in zip(
            result["ids"],
            documents,
            metadatas
        ):
            items.append({
                "id": document_id,
                "document": document,
                "metadata": metadata
            })

        return items

    def delete_documents(
        self,
        ids: list[str]
    ) -> int:
        clean_ids = [
            document_id.strip()
            for document_id in ids
            if document_id.strip()
        ]

        if not clean_ids:
            return 0

        existing = self.collection.get(
            ids=clean_ids,
            include=[]
        )

        existing_ids = existing["ids"]

        if not existing_ids:
            return 0

        self.collection.delete(
            ids=existing_ids
        )

        return len(existing_ids)
        


if __name__ == "__main__":
    store = VectorStore()

    store.upsert_documents(
        documents=[
            "This document exists only for deletion testing."
        ],
        ids=[
            "delete-test-1"
        ],
        metadatas=[
            {
                "source": "delete-test"
            }
        ]
    )

    print(
        "Before:",
        store.collection.count()
    )

    deleted_count = store.delete_documents(
        ids=["delete-test-1", "does-not-exist"]
    )

    print(
        "Deleted:",
        deleted_count
    )

    print(
        "After:",
        store.collection.count()
    )