from abc import ABC, abstractmethod
from sentence_transformers import SentenceTransformer


class EmbeddingProvider(ABC):

    @abstractmethod
    def embed_documents(
        self,
        texts: list[str]
    ) -> list[list[float]]:
        pass

    @abstractmethod
    def embed_query(
        self,
        text: str
    ) -> list[float]:
        pass

    @abstractmethod
    def embed_queries(
        self,
        queries: list[str],
    ) -> list[list[float]]:
        pass

class SentenceTransformerEmbedding(EmbeddingProvider):

    def __init__(
            self,
            model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    ):
        self.model = SentenceTransformer(model_name)

    def embed_documents(
            self,
            texts: list[str]
    )-> list[list[float]]:
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

        return embeddings.tolist()

    def embed_query(
            self,
            text: str
    ) -> list[float]:
        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    def embed_queries(
        self,
        queries: list[str]
    ) -> list[list[float]]:
        embeddings = self.model.encode(
            queries,
            normalize_embeddings=True
        )

        return embeddings.tolist()