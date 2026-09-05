import re
from collections.abc import Iterable

def split_paragraphs(text: str) -> list[str]:
    normalized_text = text.replace("\r\n", "\n")

    paragraphs = normalized_text.split("\n\n")

    return [
        paragraph.strip()
        for paragraph in paragraphs
            if paragraph.strip()
    ]

def window_chunks(
    text: str,
    max_chars: int = 600,
    overlap: int = 80
) -> list[str]:
    if max_chars <= 0:
        raise ValueError("max_chars must be greater than 0")

    if overlap < 0:
        raise ValueError("overlap cannot be negative")

    if overlap >= max_chars:
        raise ValueError("overlap must be smaller than max_chars")

    chunks: list[str] = []
    start = 0

    while start < len(text):
        end = min(start + max_chars, len(text))

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end == len(text):
            break

        start = end - overlap

    return chunks

def chunk_text(
    text: str,
    max_chars: int = 600,
    overlap: int = 80
) -> list[str]:
    chunks: list[str] = []

    paragraphs = split_paragraphs(text)

    for paragraph in paragraphs:
        if len(paragraph) <= max_chars:
            chunks.append(paragraph)
        else:
            paragraph_chunks = window_chunks(
                paragraph,
                max_chars= max_chars,
                overlap= overlap
            )
            chunks.extend(paragraph_chunks)
    return chunks


def split_by_delimiters(
        text: str,
         delimiters: str = "。！？?!.",
) -> list[str]:
    if not delimiters:
        return [text]

    normalized_text = text.replace("\r\n", "\n")

    escaped_delimiters = re.escape(delimiters)

    pattern = rf"[^{escaped_delimiters}]+(?:[{escaped_delimiters}]+)?"

    sentences = re.findall(pattern, normalized_text)

    return[
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]

def chunk_text_punctuation(
        text: str,
        delimiters: str = "。！？?!.",
        max_chars: int = 600,
        overlap: int = 80
) -> list[str]:
    if max_chars <= 0:
        raise ValueError("max_chars must be greater than 0")

    sentences = split_by_delimiters(
        text=text,
        delimiters=delimiters
    )

    chunks: list[str] = []
    current_chunk = ""


    for sentence in sentences:
        if not current_chunk:
            candidate = sentence

        else:
            candidate = f"{current_chunk} {sentence}"

        if len(candidate) <= max_chars:
            current_chunk = candidate

        else:
            if current_chunk:
                chunks.append(current_chunk)

            if len(sentence) <= max_chars:
                current_chunk = sentence
            else:
                long_sentence_chunks = window_chunks(
                    sentence,
                    max_chars=max_chars,
                    overlap=overlap
                )

                chunks.extend(long_sentence_chunks)
                current_chunk = ""

    if current_chunk:
        chunks.append(current_chunk)

    return chunks

    
def chunk_text_strategy(
        text: str,
        strategy: str = "window",
        max_chars: int = 600,
        overlap: int = 80,
        delimiters: str | None = None
) -> list[str]:

    if strategy == "punctuation":
        selected_delimiters = delimiters or "。！？?!."

        return chunk_text_punctuation(
            text=text,
            delimiters=selected_delimiters,
            max_chars=max_chars,
            overlap=overlap
        )

    if strategy == "window":
        return chunk_text(
            text=text,
            max_chars=max_chars,
            overlap=overlap
        )

    raise ValueError(
        f"Unknown chunk strategy: {strategy}"
    )

def chunk_many(
        documents: Iterable[str],
        strategy: str = "window",
        max_chars: int = 600,
        overlap: int = 80,
        delimiters: str | None = None
) -> list[str]:

    all_chunks: list[str] = []

    for document in documents:
        document_chunks = chunk_text_strategy(
            text=document,
            strategy=strategy,
            max_chars=max_chars,
            overlap=overlap,
            delimiters=delimiters
        )

        all_chunks.extend(document_chunks)

    return all_chunks





if __name__ == "__main__":
    documents = [
        "Password reset failed. Please check your email.",
        "Payment was declined. Please verify your card information.",
        "The order has not arrived. Check the tracking information."
    ]

    results = chunk_many(
        documents=documents,
        strategy="punctuation",
        max_chars=50,
        overlap=10
    )

    for index, chunk in enumerate(results, start=1):
        print(f"{index}: {chunk}")