import pytest

from app.rag.chunk import (
    split_paragraphs,
    window_chunks,
    chunk_text_punctuation,
    chunk_many,
)


def test_split_paragraphs():
    text = "First paragraph.\n\nSecond paragraph."

    assert split_paragraphs(text) == [
        "First paragraph.",
        "Second paragraph."
    ]


def test_window_chunks_with_overlap():
    result = window_chunks(
        "ABCDEFGHIJKL",
        max_chars=5,
        overlap=2
    )

    assert result == [
        "ABCDE",
        "DEFGH",
        "GHIJK",
        "JKL"
    ]


def test_punctuation_chunks():
    text = "Password reset failed. Please check your email."

    result = chunk_text_punctuation(
        text,
        max_chars=30,
        overlap=5
    )

    assert result == [
        "Password reset failed.",
        "Please check your email."
    ]


def test_chunk_many():
    documents = [
        "First document.",
        "Second document."
    ]

    result = chunk_many(
        documents,
        strategy="punctuation"
    )

    assert result == [
        "First document.",
        "Second document."
    ]


def test_invalid_max_chars():
    with pytest.raises(ValueError):
        window_chunks(
            "Example",
            max_chars=0,
            overlap=0
        )