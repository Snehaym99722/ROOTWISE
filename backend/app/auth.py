"""Small local reviewer-authentication helper for the approval prototype.

This is an assignment-grade, password re-authenticated review flow. It is not
a validated identity provider or a claim of 21 CFR Part 11 compliance.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from typing import Any

HASH_ITERATIONS = 310_000
ALLOWED_REVIEW_ROLES = {"QA Technical Reviewer", "Qualified Person (QP)"}


def hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, HASH_ITERATIONS)
    return f"pbkdf2_sha256${HASH_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, salt_hex, expected = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), int(rounds)).hex()
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def reviewers() -> dict[str, dict[str, Any]]:
    try:
        entries = json.loads(os.getenv("ROOTWISE_REVIEWERS_JSON", "[]"))
    except json.JSONDecodeError as exc:
        raise ValueError("ROOTWISE_REVIEWERS_JSON must be a JSON array.") from exc
    if not isinstance(entries, list):
        raise ValueError("ROOTWISE_REVIEWERS_JSON must be a JSON array.")
    result: dict[str, dict[str, Any]] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        email = str(entry.get("email", "")).strip().lower()
        role = str(entry.get("role", ""))
        if email and role in ALLOWED_REVIEW_ROLES and entry.get("password_hash"):
            result[email] = entry
    return result


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip("=")


def _unb64(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def issue_token(user: dict[str, Any]) -> str:
    secret = os.getenv("ROOTWISE_SESSION_SECRET", "")
    if len(secret) < 32:
        raise ValueError("Set ROOTWISE_SESSION_SECRET to a random value of at least 32 characters.")
    payload = {
        "sub": str(user["email"]).lower(),
        "name": str(user.get("display_name") or user["email"]),
        "role": str(user["role"]),
        "exp": int(time.time()) + 600,
    }
    encoded = _b64(json.dumps(payload, separators=(",", ":")).encode())
    signature = hmac.new(secret.encode(), encoded.encode(), hashlib.sha256).digest()
    return f"{encoded}.{_b64(signature)}"


def verify_token(token: str) -> dict[str, Any] | None:
    secret = os.getenv("ROOTWISE_SESSION_SECRET", "")
    if len(secret) < 32:
        return None
    try:
        encoded, supplied = token.split(".", 1)
        expected = _b64(hmac.new(secret.encode(), encoded.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(supplied, expected):
            return None
        payload = json.loads(_unb64(encoded))
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        if payload.get("role") not in ALLOWED_REVIEW_ROLES:
            return None
        return payload
    except (ValueError, TypeError, json.JSONDecodeError):
        return None


def make_password_hash_cli() -> None:
    from getpass import getpass

    first = getpass("Reviewer password: ")
    second = getpass("Confirm password: ")
    if not first or first != second:
        raise SystemExit("Passwords must be non-empty and match.")
    print(hash_password(first))
